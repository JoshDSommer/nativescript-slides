import { Button } from 'ui/button';
import { StackLayout } from 'ui/layouts/stack-layout';
import { AbsoluteLayout } from 'ui/layouts/absolute-layout';
export interface ISlideMap {
    panel: StackLayout;
    left?: ISlideMap;
    right?: ISlideMap;
}
export declare class SlideUtilities {
    private static direction;
    static buildSlideMap(views: StackLayout[]): ISlideMap;
    static applySwipe(wrapper: AbsoluteLayout, pageWidth: number, panelMap: ISlideMap, btnPrevious: Button, btnNext: Button): void;
    static showRightSlide(panelMap: ISlideMap, wrapper: any, pageWidth: any, btnPrevious: Button, btnNext: Button): void;
    static showLeftSlide(panelMap: ISlideMap, wrapper: any, pageWidth: any, btnPrevious: Button, btnNext: Button): void;
}
