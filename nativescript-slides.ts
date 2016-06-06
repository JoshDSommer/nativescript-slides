import * as app from 'application';
import * as Platform from 'platform';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';
import {StackLayout} from 'ui/layouts/stack-layout';
import {View} from 'ui/core/view';
import { Button } from 'ui/button';
import {Label} from 'ui/label';
import * as AnimationModule from 'ui/animation';
import * as gestures from 'ui/gestures';
import {AnimationCurve, Orientation} from 'ui/enums';
import {Color} from 'color';
import {Image} from 'ui/image';

// declare const android:any;

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
	index: number;
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
	private _velocityScrolling: boolean;
	private _androidTranslucentStatusBar: boolean;
	private _androidTranslucentNavBar: boolean;
	private timer_reference: number;
	private _angular: boolean;
	private _disablePan: boolean;
	private _footer: StackLayout;
	private _pageIndicators: boolean;
	private _indicatorsColor: string;

	/* page indicator stuff*/
	get pageIndicators(): boolean {
		return this._pageIndicators;
	}
	set pageIndicators(value: boolean) {
		this._pageIndicators = value;
	}

	get indicatorsColor(): string {
		return this._indicatorsColor;
	}
	set indicatorsColor(value: string) {
		this._indicatorsColor = value;
	}

	get hasNext(): boolean {
		return !!this.currentPanel.right;
	}
	get hasPrevious(): boolean {
		return !!this.currentPanel.left;
	}

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

	get disablePan() {
		return this._disablePan;
	}

	set disablePan(value: boolean) {
		this._disablePan = value;
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

	get velocityScrolling(): boolean {
		return this._velocityScrolling;
	}
	set velocityScrolling(value: boolean) {
		this._velocityScrolling = value;
	}
	get pageWidth() {
		return this._pageWidth;
	}

	get angular(): boolean {
		return this._angular;
	}

	set angular(value: boolean) {
		this._angular = value;
	}

	get android(): any {
		return;
	}

	get ios(): any {
		return;
	}

	get currentIndex(): number {
		return this.currentPanel.index;
	}

	constructor() {
		super();
		this.setupDefaultValues();
		// if being used in an ng2 app we want to prevent it from excuting the constructView
		// until it is called manually in ngAfterViewInit.

		this.constructView(true);
	}

	private setupDefaultValues(): void {
		this._loaded = false;
		if (this._loop == null) {
			this.loop = false;
		}

		this.transitioning = false;
		this._pageWidth = Platform.screen.mainScreen.widthDIPs;

		if (this._interval == null) {
			this.interval = 0;
		}

		if (this._disablePan == null) {
			this.disablePan = false;
		}

		if (this._velocityScrolling == null) {
			this._velocityScrolling = false;
		}
		if (this._angular == null) {
			this.angular = false;
		}

		if (this._pageIndicators == null) {
			this._pageIndicators = false;
		}
		if (this.indicatorsColor == null) {
			this.indicatorsColor = "#fff"; //defaults to white.
		}
	}

	public constructView(constructor: boolean = false): void {


		this.on(AbsoluteLayout.loadedEvent, (data: any) => {
			if (!this._loaded) {
				this._loaded = true;
				if (this.angular === true && constructor === true) {
					return;
				}
				// Android Translucent bars API >= 19 only

				if (app.android && this.androidTranslucentStatusBar === true || this._androidTranslucentNavBar === true && Platform.device.sdkVersion >= '19') {
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

				if (this.pageIndicators) {

					let iColor = this.indicatorsColor;
					//check if invalid and set to white (#fff)
					if (!Color.isValid(iColor)) {
						iColor = '#fff';
					}

					this._footer = this.buildFooter(slides.length, 0, iColor);
					this.insertChild(this._footer, this.getChildrenCount());
					//	this.setActivePageIndicator(0);
				}


				this.currentPanel = this.buildSlideMap(slides);
				this.currentPanel.panel.translateX = -this.pageWidth;

				if (this.disablePan === false) {
					this.applySwipe(this.pageWidth);
				}

				//handles application orientation change
				app.on(app.orientationChangedEvent, (args: app.OrientationChangedEventData) => {
					//event and page orientation didn't seem to alwasy be on the same page so setting it in the time out addresses this.
					setTimeout(() => {
						this._pageWidth = Platform.screen.mainScreen.widthDIPs;
						this.eachLayoutChild((view: View) => {
							if (view instanceof StackLayout) {
								AbsoluteLayout.setLeft(view, this.pageWidth);
								view.width = this.pageWidth;
							}
						});

						if (this.disablePan === false) {
							this.applySwipe(this.pageWidth);
						}
						let topOffset = Platform.screen.mainScreen.heightDIPs - 105;
						if (this.pageIndicators) {
							AbsoluteLayout.setTop(this._footer, topOffset);
						}
						this.currentPanel.panel.translateX = -this.pageWidth;
					}, 100);
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
		if (!this.hasNext)
			return;

		this.direction = direction.left;
		this.transitioning = true;
		this.showRightSlide(this.currentPanel).then(() => {
			this.setupPanel(this.currentPanel.right);
		});
	}
	public previousSlide(): void {
		if (!this.hasPrevious)
			return;

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

		if (this.disablePan === false) {
			this.applySwipe(this.pageWidth);
		}
		this.setActivePageIndicator(this.currentPanel.index);
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
				endingVelocity = 250;
			} else if (args.state === gestures.GestureStateTypes.ended) {
				deltaTime = Date.now() - startTime;
				// if velocityScrolling is enabled then calculate the velocitty
				if (this.velocityScrolling) {
					endingVelocity = (args.deltaX / deltaTime) * 100;
				}

				if (args.deltaX > (pageWidth / 3) || (this.velocityScrolling && endingVelocity > 32)) { ///swiping left to right.
					if (this.hasPrevious) {
						this.transitioning = true;
						this.showLeftSlide(this.currentPanel, args.deltaX, endingVelocity).then(() => {
							this.setupPanel(this.currentPanel.left);
						});
					}
					return;
				} else if (args.deltaX < (-pageWidth / 3) || (this.velocityScrolling && endingVelocity < -32)) {
					if (this.hasNext) {
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
						duration: 200,
						curve: AnimationCurve.easeOut
					});
					if (this.hasNext) {
						this.currentPanel.right.panel.animate({
							translate: { x: 0, y: 0 },
							duration: 200,
							curve: AnimationCurve.easeOut
						});
						if (app.ios) //for some reason i have to set these in ios or there is some sort of bounce back.
							this.currentPanel.right.panel.translateX = 0;
					}
					if (this.hasPrevious) {
						this.currentPanel.left.panel.animate({
							translate: { x: -this.pageWidth * 2, y: 0 },
							duration: 200,
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

					if (this.hasNext) {
						this.direction = direction.left;
						this.currentPanel.panel.translateX = args.deltaX - this.pageWidth;
						this.currentPanel.right.panel.translateX = args.deltaX;

					}
				} else if (!this.transitioning
					&& previousDelta !== args.deltaX
					&& args.deltaX != null
					&& args.deltaX > 0) {

					if (this.hasPrevious) {
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

	private showRightSlide(panelMap: ISlideMap, offset: number = this.pageWidth, endingVelocity: number = 32): AnimationModule.AnimationPromise {
		let animationDuration: number;
		if (this.velocityScrolling) {
			let elapsedTime = Math.abs(offset / endingVelocity) * 100;
			animationDuration = Math.max(Math.min(elapsedTime, 100), 64);
		} else {
			animationDuration = 300; // default value
		}

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

	private showLeftSlide(panelMap: ISlideMap, offset: number = this.pageWidth, endingVelocity: number = 32): AnimationModule.AnimationPromise {

		let animationDuration: number;
		if (this.velocityScrolling) {
			let elapsedTime = Math.abs(offset / endingVelocity) * 100;
			animationDuration = Math.max(Math.min(elapsedTime, 100), 64);
		} else {
			animationDuration = 300; // default value
		}

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

	/**
	 * currently deprecated.... will come back to life for navigation dots.
	 *  */
	private buildFooter(pageCount: number = 5, activeIndex: number = 0, iColor: string): StackLayout {
		let footerInnerWrap = new StackLayout();

		footerInnerWrap.height = 50;

		this.setwidthPercent(footerInnerWrap, 100);
		AbsoluteLayout.setLeft(footerInnerWrap, 0);
		AbsoluteLayout.setTop(footerInnerWrap, 0);

		footerInnerWrap.orientation = 'horizontal';
		footerInnerWrap.verticalAlignment = 'top';
		footerInnerWrap.horizontalAlignment = 'center';

		let i = 0;
		while (i < pageCount) {
			footerInnerWrap.addChild(this.createIndicator(iColor));
			i++;
		}

		let activeIndicator = footerInnerWrap.getChildAt(0);
		activeIndicator.className = 'slide-indicator-active';
		activeIndicator.opacity = 0.9;

		footerInnerWrap.marginTop = <any>'88%';

		return footerInnerWrap;
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
		views.forEach((view: StackLayout, index: number) => {
			slideMap.push({
				panel: view,
				index: index,
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
		}
		this.startSlideshow();
		return slideMap[0];
	}

	createIndicator(indicatorColor: string): Label {
		let indicator = new Label();
		indicator.backgroundColor = new Color(indicatorColor);
		indicator.opacity = 0.4;
		indicator.width = 10;
		indicator.height = 10;
		indicator.marginLeft = 2.5;
		indicator.marginRight = 2.5;
		indicator.marginTop = 0;
		indicator.borderRadius = 5;
		return indicator;
	}

	setActivePageIndicator(index: number) {

		this._footer.eachLayoutChild((view: View) => {
			if (view instanceof Label) {
				view.opacity = 0.4;
				view.className = 'slide-indicator-inactive';
			}
		});
		let activeIndicator = this._footer.getChildAt(index);
		activeIndicator.className = 'slide-indicator-active';
		activeIndicator.opacity = 0.9;

	}
}
