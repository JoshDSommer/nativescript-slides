import * as app from 'application';
import * as Platform from 'platform';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';
import {StackLayout} from 'ui/layouts/stack-layout';
import {View} from 'ui/core/view';
import { Button } from 'ui/button';
import {Label} from 'ui/label';
import * as AnimationModule from 'ui/animation';
import * as gestures from 'ui/gestures';

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

export class IntroSlides extends AbsoluteLayout {
	private _loaded: boolean;
	private currentPanel: ISlideMap;
	private _pageWidth: number;
	private transitioning: boolean;
	private direction: direction = direction.none;
	private _loop: boolean

	get loop() {
		return this._loop;
	}

	set loop(value: boolean) {
		this._loop = value;
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



		this.on(AbsoluteLayout.loadedEvent, (data: any) => {
			if (!this._loaded) {
				this._loaded = true;

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

	public nextSlide() {
		this.transitioning = true;
		this.showRightSlide(this.currentPanel).then(() => {
			this.setupRightPanel();
		});
	}
	public previousSlide() {
		this.transitioning = true;
		this.showLeftSlide(this.currentPanel).then(() => {
			this.setupLeftPanel();
		});
	}

	private setupLeftPanel() {
		this.direction = direction.none;
		this.transitioning = false;
		this.currentPanel.panel.off('pan');
		this.currentPanel = this.currentPanel.left;
		this.applySwipe(this.pageWidth);
	}

	private setupRightPanel() {
		this.direction = direction.none;
		this.transitioning = false;
		this.currentPanel.panel.off('pan');
		this.currentPanel = this.currentPanel.right;
		this.applySwipe(this.pageWidth);
	}

	private applySwipe(pageWidth: number) {
		let previousDelta = -1; //hack to get around ios firing pan event after release

		this.currentPanel.panel.on('pan', (args: gestures.PanGestureEventData): void => {
			if (args.state === gestures.GestureStateTypes.ended) {
				if (this.transitioning === false) {
					this.transitioning = true;
					this.currentPanel.panel.animate({
						translate: { x: -this.pageWidth, y: 0 },
						duration: 250,
					});
					if (this.currentPanel.right != null) {
						this.currentPanel.right.panel.animate({
							translate: { x: 0, y: 0 },
							duration: 250,
						});
						if (app.ios) //for some reason i have to set these in ios or there is some sort of bounce back.
							this.currentPanel.right.panel.translateX = 0;
					}
					if (this.currentPanel.left != null) {
						this.currentPanel.left.panel.animate({
							translate: { x: -this.pageWidth * 2, y: 0 },
							duration: 250,
						});
						if (app.ios)
							this.currentPanel.left.panel.translateX = -this.pageWidth;

					}
					if (app.ios)
						this.currentPanel.panel.translateX = -this.pageWidth;

					this.transitioning = false;

				}
			} else {
				if (!this.transitioning && previousDelta !== args.deltaX && args.deltaX != null && args.deltaX < -5) {
					// console.log('android ' + (<android.view.MotionEvent>(<gestures.tou>args).android).;
					if (this.currentPanel.right != null) {

						this.direction = direction.left;
						this.currentPanel.panel.translateX = args.deltaX - this.pageWidth;
						this.currentPanel.right.panel.translateX = args.deltaX;

						if (args.deltaX < ((pageWidth / 3) * -1)) {
							this.transitioning = true;
							this.showRightSlide(this.currentPanel, args.deltaX).then(() => {
								this.setupRightPanel();
							});;
						}
					}
				}

				if (!this.transitioning && previousDelta !== args.deltaX && args.deltaX != null && args.deltaX > 5) {
					if (this.currentPanel.left != null) {
						this.direction = direction.right;
						this.currentPanel.panel.translateX = args.deltaX - this.pageWidth;
						this.currentPanel.left.panel.translateX = -(this.pageWidth * 2) + args.deltaX;
						if (args.deltaX > pageWidth / 3) { ///swiping left to right.
							this.transitioning = true;
							this.showLeftSlide(this.currentPanel, args.deltaX).then(() => {
								this.setupLeftPanel();
							});
						}
					}
				}
				if (args.deltaX !== 0) {
					previousDelta = args.deltaX;
				}

			}
		});
	}

	private showRightSlide(panelMap: ISlideMap, offset: number = 0): AnimationModule.AnimationPromise {
		let transition = new Array();
		transition.push({
			target: panelMap.right.panel,
			translate: { x: -this.pageWidth, y: 0 },
			duration: 300,
		});
		transition.push({
			target: panelMap.panel,
			translate: { x: -this.pageWidth * 2, y: 0 },
			duration: 300,
		});

		let animationSet = new AnimationModule.Animation(transition, false);

		return animationSet.play();
	}

	private showLeftSlide(panelMap: ISlideMap, offset: number = 0): AnimationModule.AnimationPromise {
		let transition = new Array();
		transition.push({
			target: panelMap.left.panel,
			translate: { x: -this.pageWidth, y: 0 },
			duration: 300,
		});
		transition.push({
			target: panelMap.panel,
			translate: { x: 0, y: 0 },
			duration: 300,
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
		return slideMap[0];
	}
}
