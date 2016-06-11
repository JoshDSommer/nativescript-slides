import {Observable, EventData} from 'data/observable';
import * as pages from 'ui/page';
import * as frameModule from 'ui/frame'

var page;


// Event handler for Page "loaded" event attached in main-page.xml
export function pageLoaded(args: EventData) {
	// Get the event sender
	page = <pages.Page>args.object;

}

export function onLoadMain(args){
    var navigationEntry = {
        moduleName: "./views/main-page",
        animated: false
    };

    frameModule.topmost().navigate(navigationEntry);
}

export function onLoadDynamic(args){
    var navigationEntry = {
        moduleName: "./views/dynamic-page",
        animated: false
    };

    frameModule.topmost().navigate(navigationEntry);
}

export function onLoadCarousel(args) {
        var navigationEntry = {
        moduleName: "./views/carousel-page",
        animated: false
    };

    frameModule.topmost().navigate(navigationEntry);
}