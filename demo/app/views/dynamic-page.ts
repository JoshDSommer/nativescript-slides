import * as observable from 'data/observable';
import * as pages from 'ui/page';
import * as colorModule from 'color';
import * as stackModule from 'ui/layouts/stack-layout'
import * as labelModule from 'ui/label'
import * as buttonModule from 'ui/button'
import * as gridModule from 'ui/layouts/grid-layout'
import * as frameModule from 'ui/frame'
import * as slides from 'nativescript-slides/nativescript-slides'

let slideCount : number = 6;

// Event handler for Page "loaded" event attached in main-page.xml
export function navigatedTo(args: observable.EventData) {
	var page = <pages.Page>args.object;
	page.actionBarHidden = true;
}

export function onSlideContainerLoaded(args) {
    let slideContainer = <slides.SlideContainer>args.object;

    //Construct the slides
    for(var i=1; i < slideCount; i++){
        slideContainer.addChild(getSlide("Page " + i, "slide-" + i));
    }

    var lastSlide = getSlide("Page " + i, "slide-" + i);

    var homeButton = new buttonModule.Button();
    homeButton.text = "Home";
    homeButton.color = new colorModule.Color("#FFF");

    homeButton.on("tap", ()=>{
        var navigationEntry = {
            moduleName: "loader",
            animated: false,
            clearHistory: true
        };

        frameModule.topmost().navigate(navigationEntry);
    });

    lastSlide.addChild(homeButton);
    slideContainer.addChild(lastSlide);
}

function getSlide(labelText: string, className: string)  {
    let slide = new slides.Slide();
    slide.className = className;

    let label = new labelModule.Label();
    label.text = labelText;
    slide.addChild(label);

    let label1 = new labelModule.Label();
    label1.text = "Look ma, no XML!";
    label1.className = "subtext";
    slide.addChild(label1);

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
