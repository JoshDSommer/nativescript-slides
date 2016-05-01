import * as Platform from 'platform';
import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import { Button } from 'ui/button';
import {Color} from 'color';
import {ListView} from 'ui/list-view';
import {View } from 'ui/core/view';
import {ScrollView} from 'ui/scroll-view';
import * as gestures from 'ui/gestures';
import {StackLayout} from 'ui/layouts/stack-layout';
import {Label} from 'ui/label';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';

export interface ISlideMap {
	panel: StackLayout;
	left?: ISlideMap;
	right?: ISlideMap;
}


export class SlideUtilities {
	private static direction: string;

	public static buildSlideMap(views: StackLayout[]) {
		let slideMap: ISlideMap[] = [];
		views.forEach((view: StackLayout) => {
			slideMap.push({
				panel: view
			});
		});
		slideMap.forEach((mapping: ISlideMap, index: number) => {
			mapping.left = slideMap[index - 1];
			mapping.right = slideMap[index + 1];
		});
		return slideMap[0];
	}

	public static applySwipe(wrapper: AbsoluteLayout, pageWidth: number, panelMap: ISlideMap, btnPrevious: Button, btnNext: Button) {
		let previousDelta = -1; //hack to get around ios firing pan event after release

		// btnPrevious = <Button>wrapper.getViewById('btn-info-previous');
		// btnNext = <Button>wrapper.getViewById('btn-info-next');
		btnPrevious.visibility = 'collapse';
		btnNext.visibility = 'collapse';
		if (panelMap.left != null) {
			btnPrevious.visibility = 'visible';
		}
		if (panelMap.right != null) {
			btnNext.visibility = 'visible';
		}

		btnNext.off('tap');
		btnPrevious.off('tap');

		btnNext.on('tap', () => {
			this.showRightSlide(panelMap, wrapper, pageWidth, btnPrevious, btnNext);
			panelMap.right.panel.width = pageWidth - panelMap.panel.width;
			AbsoluteLayout.setLeft(panelMap.right.panel, panelMap.panel.width);
		});
		btnPrevious.on('tap', () => {
			this.showLeftSlide(panelMap, wrapper, pageWidth, btnPrevious, btnNext);
		});


		panelMap.panel.on('touch, pan', (args: any): void => {
			if ((<gestures.TouchGestureEventData>args).action === gestures.TouchAction.up) {
				//if the pages on left hasn't come out far enough, snap back and show current page full width.)
				if (this.direction === 'left' && panelMap.right != null && panelMap.panel.width > ((pageWidth / 3) * 2)) {
					panelMap.right.panel.width = 0;
					panelMap.panel.width = pageWidth;
					AbsoluteLayout.setLeft(panelMap.panel, 0);
					AbsoluteLayout.setLeft(panelMap.right.panel, pageWidth);
					this.direction = null;
					return;
				}
				if (this.direction === 'right' && panelMap.panel.width > (pageWidth / 2)) {
					if (panelMap.left != null) {
						panelMap.left.panel.width = 0;
					}
					panelMap.panel.width = pageWidth;
					// AbsoluteLayout.setLeft(panelMap.right.panel, pageWidth);
					AbsoluteLayout.setLeft(panelMap.panel, 0);
					this.direction = null;
					return;
				}
			}
			if ((<gestures.GestureEventData>args).eventName = 'pan') {
				if (panelMap.right != null && previousDelta !== args.deltaX) {
					if (args.deltaX < -5) {
						this.direction = 'left';
						panelMap.panel.width = pageWidth + args.deltaX;

						if (panelMap.panel.width < ((pageWidth / 3) * 2)) {
							this.showRightSlide(panelMap, wrapper, pageWidth, btnPrevious, btnNext);
						}
						panelMap.right.panel.width = pageWidth - panelMap.panel.width;
						AbsoluteLayout.setLeft(panelMap.right.panel, panelMap.panel.width);
					}
				}

				if (panelMap.left != null && previousDelta !== args.deltaX) {
					if (args.deltaX > 5) { ///swiping left to right.
						this.direction = 'right';

						AbsoluteLayout.setLeft(panelMap.panel, args.deltaX);
						panelMap.left.panel.width = args.deltaX;
						if (args.deltaX > (pageWidth / 4)) {
							this.showLeftSlide(panelMap, wrapper, pageWidth, btnPrevious, btnNext);
						}
					}
				}
				if (args.deltaX !== 0)
					previousDelta = args.deltaX;
			}
		});
	}

	public static showRightSlide(panelMap: ISlideMap, wrapper, pageWidth, btnPrevious: Button, btnNext: Button) {
		panelMap.panel.width = 0;
		panelMap.panel.off('pan, touch');
		this.applySwipe(wrapper, pageWidth, panelMap.right, btnPrevious, btnNext);
		panelMap.right.panel.width = pageWidth;
		this.direction = null;
	}

	public static showLeftSlide(panelMap: ISlideMap, wrapper, pageWidth, btnPrevious: Button, btnNext: Button) {
		panelMap.left.panel.width = pageWidth;
		AbsoluteLayout.setLeft(panelMap.left.panel, 0);
		AbsoluteLayout.setLeft(panelMap.panel, pageWidth);
		panelMap.panel.off('pan, touch');
		this.applySwipe(wrapper, pageWidth, panelMap.left, btnPrevious, btnNext);

		if (panelMap.right != null) {
			AbsoluteLayout.setLeft(panelMap.right.panel, pageWidth);
			panelMap.right.panel.width = 0;
		}
	}

}