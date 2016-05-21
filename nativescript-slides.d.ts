import { AbsoluteLayout } from 'ui/layouts/absolute-layout';
import { StackLayout } from 'ui/layouts/stack-layout';
export declare class Slide extends StackLayout {
}
export interface ISlideMap {
    panel: StackLayout;
    left?: ISlideMap;
    right?: ISlideMap;
}
export declare class SlideContainer extends AbsoluteLayout {
    private currentPanel;
    private transitioning;
    private direction;
    private _loaded;
    private _pageWidth;
    private _loop;
    private _interval;
    private _velocityScrolling;
    private _androidTranslucentStatusBar;
    private _androidTranslucentNavBar;
    private timer_reference;
    hasNext: boolean;
    hasPrevious: boolean;
    interval: number;
    loop: boolean;
    androidTranslucentStatusBar: boolean;
    androidTranslucentNavBar: boolean;
    velocityScrolling: boolean;
    pageWidth: number;
    android: any;
    ios: any;
    constructor();
    private setupDefaultValues();
    constructView(): void;
    private carousel(isenabled, time);
    private rebindSlideShow();
    stopSlideshow(): void;
    startSlideshow(): void;
    nextSlide(): void;
    previousSlide(): void;
    resetAndroidTranslucentFlags(): void;
    private setupPanel(panel);
    private applySwipe(pageWidth);
    private showRightSlide(panelMap, offset?, endingVelocity?);
    private showLeftSlide(panelMap, offset?, endingVelocity?);
    private buildFooter();
    private setwidthPercent(view, percentage);
    private newFooterButton(name);
    private buildSlideMap(views);
}
