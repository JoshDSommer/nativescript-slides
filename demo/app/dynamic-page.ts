import * as observable from 'data/observable';
import * as pages from 'ui/page';
import * as colorModule from 'color';
import * as stackModule from 'ui/layouts/stack-layout'
import * as labelModule from 'ui/label'
import * as gridModule from 'ui/layouts/grid-layout'
import * as slides from 'nativescript-slides/nativescript-slides'

// Event handler for Page "loaded" event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
	var page = <pages.Page>args.object;
	page.actionBarHidden = true;
}

export function onSlideContainerLoaded(args) {
    let slideContainer = <slides.SlideContainer>args.object;

    //Construct the slides
    slideContainer.addChild(getSlide("Page 1", "slide-1"));
    slideContainer.addChild(getSlide("Page 2", "slide-2"));
    slideContainer.addChild(getSlide("Page 3", "slide-3"));
    slideContainer.addChild(getSlide("Page 4", "slide-4"));
    slideContainer.addChild(getSlide("Page 5", "slide-5"));

}

function getSlide(labelText: string, className: string)  {
    let slide = new slides.Slide();
    slide.className = className;
    let label = new labelModule.Label();
    label.text = labelText;
    slide.addChild(label)

    return slide;
}


export function onStart(args){
	var data = args.eventData;
	console.log("Start: " + JSON.stringify(data));
}

export function onChanged(args){
	var data = args.eventData;
	console.log("Changed: " + JSON.stringify(data));
}

export function onCancelled(args){
	var data = args.eventData;
	console.log("Cancelled: " + JSON.stringify(data));
}

export function onFinished(args){
	console.log("Finished slides");
}