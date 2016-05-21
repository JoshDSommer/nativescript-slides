import * as app from 'application';
import * as Platform from 'platform';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';
import {StackLayout} from 'ui/layouts/stack-layout';
import {View} from 'ui/core/view';
import { Button } from 'ui/button';
import {Label} from 'ui/label';
import * as AnimationModule from 'ui/animation';
import * as gestures from 'ui/gestures';
import {AnimationCurve} from 'ui/enums';

let LayoutParams: any;
if (app.android) {
	LayoutParams = <any>android.view.WindowManager.LayoutParams;
} else {
	LayoutParams = {};
}

export class Slide extends StackLayout { }

enum direction {
	none,
	left,
	right
}

export interface ISlideMap {
	panel: StackLayout;
	left?: ISlideMap;
	right?: ISlideMap;
}

export class SlideContainer extends AbsoluteLayout {
	private currentPanel: ISlideMap;
	private transitioning: boolean;
	private direction: direction = direction.none;
	private _loaded: boolean;
	private _pageWidth: number;
	private _loop: boolean;
	private _interval: number;
	private _androidTranslucentStatusBar: boolean;
	private _androidTranslucentNavBar: boolean;
	private timer_reference: number;

	get interval() {
		return this._interval;
	}

	set interval(value: number) {
		this._interval = value;
	}

	get loop() {
		return this._loop;
	}

	set loop(value: boolean) {
		this._loop = value;
	}

	get androidTranslucentStatusBar() {
		return this._androidTranslucentStatusBar;
	}

	set androidTranslucentStatusBar(value: boolean) {
		this._androidTranslucentStatusBar = value;
	}

	get androidTranslucentNavBar() {
		return this._androidTranslucentNavBar;
	}

	set androidTranslucentNavBar(value: boolean) {
		this._androidTranslucentNavBar = value;
	}

	get pageWidth() {
		return this._pageWidth;
	}

	get android(): any {
		return;
	}

	get ios(): any {
		return;
	}

	constructor() {
		super();
		this.constructView();
	}

	constructView(): void {

		this._loaded = false;
		if (this._loop == null) {
			this.loop = false;
		}
		this.transitioning = false;

		this._pageWidth = Platform.screen.mainScreen.widthDIPs;

		if (this._interval == null) {
			this._interval = 0;
		}

		this.on(AbsoluteLayout.loadedEvent, (data: any) => {
			if (!this._loaded) {
				this._loaded = true;

				// Android Translucent bars API >= 19 only
				if (this.androidTranslucentStatusBar === true || this._androidTranslucentNavBar === true && app.android && Platform.device.sdkVersion >= '19') {
					let window = app.android.startActivity.getWindow();

					// check for status bar
					if (this._androidTranslucentStatusBar === true) {
						window.addFlags(LayoutParams.FLAG_TRANSLUCENT_STATUS);
					}

					// check for nav bar
					if (this._androidTranslucentNavBar === true) {
						window.addFlags(LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
					}
				}

				let slides: StackLayout[] = [];

				this.eachLayoutChild((view: View) => {
					if (view instanceof StackLayout) {
						AbsoluteLayout.setLeft(view, this.pageWidth);
						view.width = this.pageWidth;
						(<any>view).height = '100%'; //get around compiler
						slides.push(view);
					}
				});

				this.currentPanel = this.buildSlideMap(slides);
				this.currentPanel.panel.translateX = -this.pageWidth;
				this.applySwipe(this.pageWidth);

				app.on(app.orientationChangedEvent, (args: app.OrientationChangedEventData) => {
					this._pageWidth = Platform.screen.mainScreen.widthDIPs;
					this.eachLayoutChild((view: View) => {
						if (view instanceof StackLayout) {
							AbsoluteLayout.setLeft(view, this.pageWidth);
							view.width = this.pageWidth;
						}
					});
					this.applySwipe(this.pageWidth);
					this.currentPanel.panel.translateX = -this.pageWidth;
				});
			}
		});
	}

	private carousel(isenabled: boolean, time: number) {
		if (isenabled) {
			this.timer_reference = setInterval(() => {
				if (typeof this.currentPanel.right !== "undefined") {
					this.nextSlide();
				} else {
					clearTimeout(this.timer_reference);
				}
			}, time);
		} else {
			clearTimeout(this.timer_reference);
		}
	}
	private rebindSlideShow(): void {
		if (this.timer_reference != null) {
			this.stopSlideshow();
			this.startSlideshow();
		}
	}

	public stopSlideshow(): void {
		this.carousel(false, 0);
	}

	public startSlideshow(): void {
		if (this.interval !== 0) {
			this.carousel(true, this.interval);
		}
	}

	public nextSlide(): void {
		this.direction = direction.left;
		this.transitioning = true;
		this.showRightSlide(this.currentPanel).then(() => {
			this.setupPanel(this.currentPanel.right);
		});
	}
	public previousSlide(): void {
		this.direction = direction.right;
		this.transitioning = true;
		this.showLeftSlide(this.currentPanel).then(() => {
			this.setupPanel(this.currentPanel.left);
		});
	}

	public resetAndroidTranslucentFlags(): void {
		if (this._androidTranslucentStatusBar === true) {
			let window = app.android.startActivity.getWindow();
			window.clearFlags(LayoutParams.FLAG_TRANSLUCENT_STATUS);
		}
		if (this._androidTranslucentNavBar === true) {
			(<any>window).clearFlags(LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
		}
	}

	private setupPanel(panel: ISlideMap) {
		this.direction = direction.none;
		this.transitioning = false;
		this.currentPanel.panel.off('pan');
		this.currentPanel = panel;
		this.applySwipe(this.pageWidth);
		this.rebindSlideShow();
	}

	private applySwipe(pageWidth: number): void {
		let previousDelta = -1; //hack to get around ios firing pan event after release
		let endingVelocity = 0;
		let startTime, deltaTime;

		this.currentPanel.panel.on('pan', (args: gestures.PanGestureEventData): void => {

			if (args.state === gestures.GestureStateTypes.began) {
				startTime = Date.now();
				previousDelta = 0;
				endingVelocity = 0;
			} else if (args.state === gestures.GestureStateTypes.ended) {
				deltaTime = Date.now() - startTime;

				endingVelocity = (args.deltaX / deltaTime) * 100;

				if (args.deltaX > (pageWidth / 3) || endingVelocity > 32) { ///swiping left to right.

					if (this.currentPanel.left != null) {
						this.transitioning = true;
						this.showLeftSlide(this.currentPanel, args.deltaX, endingVelocity).then(() => {
							this.setupPanel(this.currentPanel.left);
						});
					}

					return;
				} else if (args.deltaX < (-pageWidth / 3) || endingVelocity < -32) {

					if (this.currentPanel.right != null) {
						this.transitioning = true;
						this.showRightSlide(this.currentPanel, args.deltaX, endingVelocity).then(() => {
							this.setupPanel(this.currentPanel.right);
						});
					}

					return;
				}

				if (this.transitioning === false) {
					this.transitioning = true;
					this.currentPanel.panel.animate({
						translate: { x: -this.pageWidth, y: 0 },
						duration: 100,
						curve: AnimationCurve.easeOut
					});
					if (this.currentPanel.right != null) {
						this.currentPanel.right.panel.animate({
							translate: { x: 0, y: 0 },
							duration: 100,
							curve: AnimationCurve.easeOut
						});
						if (app.ios) //for some reason i have to set these in ios or there is some sort of bounce back.
							this.currentPanel.right.panel.translateX = 0;
					}
					if (this.currentPanel.left != null) {
						this.currentPanel.left.panel.animate({
							translate: { x: -this.pageWidth * 2, y: 0 },
							duration: 100,
							curve: AnimationCurve.easeOut
						});
						if (app.ios)
							this.currentPanel.left.panel.translateX = -this.pageWidth;

					}
					if (app.ios)
						this.currentPanel.panel.translateX = -this.pageWidth;

					this.transitioning = false;

				}
			} else {

				if (!this.transitioning
					&& previousDelta !== args.deltaX
					&& args.deltaX != null
					&& args.deltaX < 0) {

					if (this.currentPanel.right != null) {

						this.direction = direction.left;
						this.currentPanel.panel.translateX = args.deltaX - this.pageWidth;
						this.currentPanel.right.panel.translateX = args.deltaX;

					}
				} else if (!this.transitioning
					&& previousDelta !== args.deltaX
					&& args.deltaX != null
					&& args.deltaX > 0) {

					if (this.currentPanel.left != null) {
						this.direction = direction.right;
						this.currentPanel.panel.translateX = args.deltaX - this.pageWidth;
						this.currentPanel.left.panel.translateX = -(this.pageWidth * 2) + args.deltaX;
					}
				}

				if (args.deltaX !== 0) {
					previousDelta = args.deltaX;
				}

			}
		});
	}

	private showRightSlide(panelMap: ISlideMap, offset: number = 0, endingVelocity: number = 32): AnimationModule.AnimationPromise {
		
		let elapsedTime = Math.abs(offset / endingVelocity) * 100;		
		let animationDuration = Math.min(elapsedTime, 100);
		let transition = new Array();
		
		transition.push({
			target: panelMap.right.panel,
			translate: { x: -this.pageWidth, y: 0 },
			duration: animationDuration,
			curve: AnimationCurve.easeOut
		});
		transition.push({
			target: panelMap.panel,
			translate: { x: -this.pageWidth * 2, y: 0 },
			duration: animationDuration,
			curve: AnimationCurve.easeOut
		});
		let animationSet = new AnimationModule.Animation(transition, false);

		return animationSet.play();
	}

	private showLeftSlide(panelMap: ISlideMap, offset: number = 0, endingVelocity: number = 32): AnimationModule.AnimationPromise {
		
		let elapsedTime = Math.abs(offset / endingVelocity) * 100;
		let animationDuration = Math.min(elapsedTime, 100);
		let transition = new Array();
		
		transition.push({
			target: panelMap.left.panel,
			translate: { x: -this.pageWidth, y: 0 },
			duration: animationDuration,
			curve: AnimationCurve.easeOut
		});
		transition.push({
			target: panelMap.panel,
			translate: { x: 0, y: 0 },
			duration: animationDuration,
			curve: AnimationCurve.easeOut
		});
		let animationSet = new AnimationModule.Animation(transition, false);

		return animationSet.play();

	}

	private buildFooter(): AbsoluteLayout {
		let footer = new AbsoluteLayout();
		let footerInnerWrap = new StackLayout();
		let footerInnerWrapLeft = new StackLayout();
		let footerInnerWrapMiddle = new StackLayout();
		let footerInnerWrapRight = new StackLayout();
		this.setwidthPercent(footer, 100);

		footerInnerWrap.orientation = 'horizontal';
		this.setwidthPercent(footerInnerWrap, 100);

		footer.addChild(footerInnerWrap);

		this.setwidthPercent(footerInnerWrapRight, 30);
		this.setwidthPercent(footerInnerWrapLeft, 30);
		this.setwidthPercent(footerInnerWrapMiddle, 40);

		footerInnerWrapLeft.addChild(this.newFooterButton('Previous'));
		footerInnerWrapRight.addChild(this.newFooterButton('Next'));

		footerInnerWrap.addChild(footerInnerWrapLeft);
		footerInnerWrap.addChild(footerInnerWrapMiddle);
		footerInnerWrap.addChild(footerInnerWrapRight);

		return footer;
	}

	private setwidthPercent(view: View, percentage: number) {
		(<any>view).width = percentage + '%';
	}

	private newFooterButton(name: string): Button {
		let button = new Button();
		button.id = 'btn-info-' + name.toLowerCase();
		button.text = name;
		this.setwidthPercent(button, 100);
		return button;
	}

	private buildSlideMap(views: StackLayout[]) {
		let slideMap: ISlideMap[] = [];
		views.forEach((view: StackLayout) => {
			slideMap.push({
				panel: view
			});
		});
		slideMap.forEach((mapping: ISlideMap, index: number) => {
			if (slideMap[index - 1] != null)
				mapping.left = slideMap[index - 1];
			if (slideMap[index + 1] != null)
				mapping.right = slideMap[index + 1];
		});

		if (this.loop) {
			slideMap[0].left = slideMap[slideMap.length - 1];
			slideMap[slideMap.length - 1].right = slideMap[0];
		}
		this.startSlideshow();
		return slideMap[0];
	}
}
