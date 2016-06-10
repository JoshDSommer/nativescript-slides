import * as observable from 'data/observable';
import * as pages from 'ui/page';


let slideContainer;

// Event handler for Page "loaded" event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
	// Get the event sender
	var page = <pages.Page>args.object;
	page.actionBarHidden = true;
	slideContainer = page.getViewById("slides");
}

export function next() {
	slideContainer.nextSlide();
}

export function prev() {
	slideContainer.previousSlide();
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