import { AbsoluteLayout } from 'ui/layouts/absolute-layout';
import { StackLayout } from 'ui/layouts/stack-layout';
import { AddChildFromBuilder } from 'ui/core/view';
export declare class Slide extends StackLayout {
}
export declare class IntroSlides extends AbsoluteLayout implements AddChildFromBuilder {
    private _childSlides;
    android: any;
    ios: any;
    constructor();
    constructView(): void;
    _addChildFromBuilder: (name: string, value: any) => void;
    private buildFooter();
    private setwidthPercent(view, percentage);
    private newButtoner(name);
}
