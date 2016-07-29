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
    private _pagerOffset;
    private _angular;
    private _disablePan;
    private _footer;
    private _pageIndicators;
    private _indicatorsColor;
    static START_EVENT: string;
    static CHANGED_EVENT: string;
    static CANCELLED_EVENT: string;
    static FINISHED_EVENT: string;
    pageIndicators: boolean;
    indicatorsColor: string;
    pagerOffset: string;
    hasNext: boolean;
    hasPrevious: boolean;
    loop: boolean;
    disablePan: boolean;
    pageWidth: number;
    angular: boolean;
    android: any;
    ios: any;
    currentIndex: number;
    constructor();
    private setupDefaultValues();
    constructView(constructor?: boolean): void;
    nextSlide(): void;
    previousSlide(): void;
    private setupPanel(panel);
    private positionPanels(panel);
    private applySwipe(pageWidth);
    private showRightSlide(panelMap, offset?, endingVelocity?);
    private showLeftSlide(panelMap, offset?, endingVelocity?);
    private setwidthPercent(view, percentage);
    private newFooterButton(name);
    private buildSlideMap(views);
    private triggerStartEvent();
    private triggerChangeEventLeftToRight();
    private triggerChangeEventRightToLeft();
    private triggerCancelEvent(cancelReason);
    private buildFooter(pageCount, activeIndex, indicatorColor);
    createIndicator(indicatorColor: string): Label;
    setActivePageIndicator(index: number): void;
}
