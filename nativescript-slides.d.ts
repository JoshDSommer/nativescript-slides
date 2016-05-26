import { AbsoluteLayout } from 'ui/layouts/absolute-layout';
import { StackLayout } from 'ui/layouts/stack-layout';
import { Label } from 'ui/label';
export declare class Slide extends StackLayout {
}
export interface ISlideMap {
    panel: StackLayout;
    index: number;
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
    private _angular;
    private _footer;
    private _pageIndicators;
    pageIndicators: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    interval: number;
    loop: boolean;
    androidTranslucentStatusBar: boolean;
    androidTranslucentNavBar: boolean;
    velocityScrolling: boolean;
    pageWidth: number;
    angular: boolean;
    android: any;
    ios: any;
    currentIndex: number;
    constructor();
    private setupDefaultValues();
    constructView(constructor?: boolean): void;
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
    private buildFooter(pageCount?, activeIndex?);
    private setwidthPercent(view, percentage);
    private newFooterButton(name);
    private buildSlideMap(views);
    createIndicator(): Label;
    setActivePageIndicator(index: number): void;
}
