import { AbsoluteLayout } from 'ui/layouts/absolute-layout';
import { StackLayout } from 'ui/layouts/stack-layout';
import { AddChildFromBuilder } from 'ui/core/view';
import { Button } from 'ui/button';
import { ISlideMap } from './utilities';
import * as AnimationModule from 'ui/animation';
export declare class Slide extends StackLayout {
}
export declare class IntroSlides extends AbsoluteLayout implements AddChildFromBuilder {
    private _childSlides;
    private _loaded;
    private currentPanel;
    private _pageWidth;
    private _btnNext;
    private _btnPrevious;
    private transitioning;
    private direction;
    btnNext: Button;
    btnPrevious: Button;
    pageWidth: number;
    android: any;
    ios: any;
    constructor();
    constructView(): void;
    private setupLeftPanel();
    private setupRightPanel();
    _addChildFromBuilder: (name: string, value: any) => void;
    private applySwipe(pageWidth);
    showRightSlide(panelMap: ISlideMap, offset?: number): AnimationModule.AnimationPromise;
    showLeftSlide(panelMap: ISlideMap, offset?: number): AnimationModule.AnimationPromise;
    private buildFooter();
    private setwidthPercent(view, percentage);
    private newFooterButton(name);
}
