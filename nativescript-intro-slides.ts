import * as app from 'application';
import * as Platform from 'platform';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';
import {StackLayout} from 'ui/layouts/stack-layout';
import {View, AddChildFromBuilder} from 'ui/core/view';
import { Button } from 'ui/button';
import {SlideUtilities, ISlideMap} from './utilities';

export class Slide extends StackLayout {

}

export class IntroSlides extends AbsoluteLayout implements AddChildFromBuilder {
	private _childSlides: View[];
	private _loaded: boolean;

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
		this._childSlides = [];

		const pageWidth = Platform.screen.mainScreen.widthDIPs;
		const pageHeight = Platform.screen.mainScreen.heightDIPs;

		this.on(AbsoluteLayout.loadedEvent, (data: any) => {
			if (!this._loaded) {
				this._loaded = true;

				let footer = this.buildFooter();
				this.addChild(footer);

				let btnPrevious = <Button>footer.getViewById('btn-info-previous');
				let btnNext = <Button>footer.getViewById('btn-info-next');

				let slides: StackLayout[] = [];
				this.eachLayoutChild((view: View) => {
					if (view instanceof StackLayout) {
						if (slides.length !== 0) {
							AbsoluteLayout.setLeft(<any>view, pageWidth);
						}
						view.width = pageWidth;
						(<any>view).height = '100%'; //get around compiler
						slides.push(view);
					}
				});

				let panelMap1 = SlideUtilities.buildSlideMap(slides);

				panelMap1.panel.width = pageWidth;
				if (isNaN(footer.height)) {
					footer.height = 76; //footer min height
				}
				AbsoluteLayout.setTop(footer, (pageHeight - footer.height));
				SlideUtilities.applySwipe(this, pageWidth, panelMap1, btnPrevious, btnNext);
			}
		});

	}

	_addChildFromBuilder = (name: string, value: any) => {
		if (value instanceof View) {
			if (value instanceof Slide) {
				this._childSlides.push(value);
			}
			this.addChild(value);
		}
	};


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


