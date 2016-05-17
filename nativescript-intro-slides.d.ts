import { AbsoluteLayout } from 'ui/layouts/absolute-layout';
import { StackLayout } from 'ui/layouts/stack-layout';
export declare class Slide extends StackLayout {
}
export interface ISlideMap {
    panel: StackLayout;
    left?: ISlideMap;
    right?: ISlideMap;
}
export declare class IntroSlides extends AbsoluteLayout {
    private _loaded;
    private currentPanel;
    private _pageWidth;
    private transitioning;
    private direction;
    private _loop;
    private _interval;
    timer_is_set: boolean;
    interval: number;
    loop: boolean;
    pageWidth: number;
    android: any;
    ios: any;
    constructor();
    constructView(): void;
    carousel(isenabled, time): void;
    nextSlide(): void;
    previousSlide(): void;
    private setupLeftPanel();
    private setupRightPanel();
    private applySwipe(pageWidth);
    private showRightSlide(panelMap, offset?);
    private showLeftSlide(panelMap, offset?);
    private buildFooter();
    private setwidthPercent(view, percentage);
    private newFooterButton(name);
    private buildSlideMap(views);
}
