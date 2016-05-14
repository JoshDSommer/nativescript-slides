import * as app from 'application';
import * as Platform from 'platform';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';
import {StackLayout} from 'ui/layouts/stack-layout';
import {View, AddChildFromBuilder} from 'ui/core/view';
import { Button } from 'ui/button';
import {SlideUtilities, ISlideMap} from './utilities';
import {Label} from 'ui/label';
import * as AnimationModule from 'ui/animation';
import * as gestures from 'ui/gestures';

export class Slide extends StackLayout {

}
enum direction {
	none,
	left,
	right
}
export class IntroSlides extends AbsoluteLayout implements AddChildFromBuilder {

	private _childSlides: View[];
	private _loaded: boolean;
	private currentPanel: ISlideMap;
	private _pageWidth: number;
	private _btnNext: Button;
	private _btnPrevious: Button;
	private transitioning: boolean;
	private direction: direction = direction.none;

	get btnNext() {
		return this._btnNext;
	}

	get btnPrevious() {
		return this._btnPrevious;
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
		this.transitioning = false;
		this._childSlides = [];

		this._pageWidth = Platform.screen.mainScreen.widthDIPs;
		const pageHeight = Platform.screen.mainScreen.heightDIPs;

		this.on(AbsoluteLayout.loadedEvent, (data: any) => {
			if (!this._loaded) {
				this._loaded = true;

				let footer = this.buildFooter();

				this._btnPrevious = <Button>footer.getViewById('btn-info-previous');
				this._btnNext = <Button>footer.getViewById('btn-info-next');

				let info = <Label>footer.getViewById('info');
				let slides: StackLayout[] = [];

				this.eachLayoutChild((view: View) => {
					if (view instanceof StackLayout) {
						AbsoluteLayout.setLeft(view, this.pageWidth);
						view.width = this.pageWidth;
						(<any>view).height = '100%'; //get around compiler
						slides.push(view);
					}
				});
				this.currentPanel = SlideUtilities.buildSlideMap(slides);

				this.btnNext.on('tap', () => {
					this.transitioning = true;
					this.showRightSlide(this.currentPanel).then(() => {
						console.log('right button done');
						this.setupRightPanel();

					});
				});
				this.btnPrevious.on('tap', () => {
					this.transitioning = true;
					this.showLeftSlide(this.currentPanel).then(() => {
						this.setupLeftPanel();
					});
				});
				//	this.addChild(footer);

				if (isNaN(footer.height)) {
					footer.height = 76; //footer min height
				}
				AbsoluteLayout.setTop(footer, (pageHeight - footer.height));
				this.currentPanel.panel.translateX = -this.pageWidth;
				this.btnPrevious.visibility = 'collapse';
				this.applySwipe(this.pageWidth);
			}
		});

	}
	private setupLeftPanel() {
		this.direction = direction.none;
		this.transitioning = false;
		this.btnNext.visibility = 'visible';
		this.btnPrevious.visibility = 'visible';
		this.currentPanel.panel.off('touch,pan');
		this.currentPanel = this.currentPanel.left;
		this.applySwipe(this.pageWidth);
		if (this.currentPanel.left == null) {
			this.btnPrevious.visibility = 'collapse';
		}
	}

	private setupRightPanel() {
		this.direction = direction.none;
		this.transitioning = false;
		this.btnNext.visibility = 'visible';
		this.btnPrevious.visibility = 'visible';
		this.currentPanel.panel.off('touch,pan');
		this.currentPanel = this.currentPanel.right;
		this.applySwipe(this.pageWidth);
		if (this.currentPanel.right == null) {
			this.btnNext.visibility = 'collapse';
		}
	}

	_addChildFromBuilder = (name: string, value: any) => {
		if (value instanceof View) {
			if (value instanceof Slide) {
				this._childSlides.push(value);
			}
			this.addChild(value);
		}
	};

	private applySwipe(pageWidth: number) {
		let previousDelta = -1; //hack to get around ios firing pan event after release

		this.currentPanel.panel.on('pan', (args: gestures.PanGestureEventData): void => {
			if (args.state === gestures.GestureStateTypes.ended) {
				if (this.transitioning === false) {
					this.transitioning = true;
					this.currentPanel.panel.translateX = -this.pageWidth;
					if (this.currentPanel.right != null) {
						this.currentPanel.right.panel.translateX = -this.pageWidth;
						this.currentPanel.right.panel.translateX = this.pageWidth;
					}
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

	public showRightSlide(panelMap: ISlideMap, offset: number = 0): AnimationModule.AnimationPromise {
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
		// panelMap.panel.off('pan');
		//	this.applySwipe(info, wrapper, pageWidth, panelMap.right, this.btnPrevious, btnNext);
	}

	public showLeftSlide(panelMap: ISlideMap, offset: number = 0): AnimationModule.AnimationPromise {
		let transition = new Array();
		transition.push({
			target: panelMap.left.panel,
			translate: { x: -this.pageWidth, y: 0 },
			duration: 500,
		});
		transition.push({
			target: panelMap.panel,
			translate: { x: 0, y: 0 },
			duration: 500,
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
}

