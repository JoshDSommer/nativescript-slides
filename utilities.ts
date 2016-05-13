import * as Platform from 'platform';
import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import { Button } from 'ui/button';
import {Color} from 'color';
import {ListView} from 'ui/list-view';
import {View } from 'ui/core/view';
import * as AnimationModule from 'ui/animation';
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
			if (slideMap[index - 1] != null)
				mapping.left = slideMap[index - 1];
			if (slideMap[index + 1] != null)
				mapping.right = slideMap[index + 1];
		});
		return slideMap[0];
	}

	// public static OrientateSlide(currentSlide: ISlideMap, pageWidth: number, wrapper: AbsoluteLayout, footer: any): void {
	// 	wrapper.removeChildren();

	// 	if (currentSlide.left != null) {
	// 		// btnPrevious.visibility = 'visible';
	// 		wrapper.addChild(currentSlide.left.panel);
	// 		AbsoluteLayout.setLeft(currentSlide.left.panel, pageWidth * -1);
	// 	}
	// 	wrapper.addChild(currentSlide.panel);
	// 	AbsoluteLayout.setLeft(currentSlide.panel, pageWidth);

	// 	if (currentSlide.right != null) {

	// 		// btnNext.visibility = 'visible';
	// 		wrapper.addChild(currentSlide.right.panel);
	// 		AbsoluteLayout.setLeft(currentSlide.right.panel, pageWidth);
	// 	}
	// 	wrapper.addChild(footer);
	// }

	// public static applySwipe(info: Label, wrapper: AbsoluteLayout, pageWidth: number, panelMap: ISlideMap, btnPrevious: Button, btnNext: Button) {
	// 	let previousDelta = -1; //hack to get around ios firing pan event after release

	// 	panelMap.panel.on('touch, pan', (args: any): void => {
	// 		if ((<gestures.GestureEventData>args).eventName = 'pan') {
	// 			if (panelMap.right != null && previousDelta !== args.deltaX) {
	// 				if (args.deltaX < -5) { //((pageWidth / 3) * 2)) {
	// 					this.direction = 'left';

	// 					this.showRightSlide(panelMap, info, wrapper, pageWidth, btnPrevious, btnNext).then(() => {
	// 						panelMap = panelMap.left;
	// 						SlideUtilities.OrientateSlide(panelMap, pageWidth, wrapper, null);
	// 					});;

	// 				}
	// 			}

	// 			if (panelMap.left != null && previousDelta !== args.deltaX) {
	// 				if (args.deltaX > 5) {//(pageWidth / 4)) { ///swiping left to right.
	// 					this.direction = 'right';
	// 					this.showLeftSlide(panelMap, info, wrapper, pageWidth, btnPrevious, btnNext).then(() => {
	// 						panelMap = panelMap.right;
	// 						SlideUtilities.OrientateSlide(panelMap, pageWidth, wrapper, null);
	// 					});
	// 				}
	// 			}
	// 			if (args.deltaX !== 0)
	// 				previousDelta = args.deltaX;
	// 		}
	// 	});
	// }





}