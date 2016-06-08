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

export function onStart(){
	console.log("START IN MAIN-PAGE");
}

export function onChanged(){
	console.log("CHANGED IN MAIN-PAGE");
}

export function onCancelled(){
	console.log("CANCELLED IN MAIN-PAGE");
}