import { StackLayout } from 'ui/layouts/stack-layout';
export interface ISlideMap {
    panel: StackLayout;
    left?: ISlideMap;
    right?: ISlideMap;
}
export declare class SlideUtilities {
    private static direction;
    static buildSlideMap(views: StackLayout[]): ISlideMap;
}
