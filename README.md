# NativeScript Slides for iOS and Android
### _The plugin formally known as nativescript-intro-slides_

### Intro slides example:
[![Nativescript Slides. Click to Play](https://img.youtube.com/vi/kGby8qtSDjM/0.jpg)](https://www.youtube.com/embed/kGby8qtSDjM)

### Image carousel example:
[![Nativescript Slides. Click to Play](https://img.youtube.com/vi/RsEqGAKm62k/0.jpg)](https://www.youtube.com/embed/RsEqGAKm62k)

_videos by [Brad Martin](https://github.com/bradmartin)_

## Example Usage:
### XML
```xml

	<Slides:SlideContainer id="slides" pageIndicators="true" indicatorsColor="#fff">
			<Slides:Slide class="slide-1">
				<Label text="This is Panel 1"  />
			</Slides:Slide>
			<Slides:Slide class="slide-2">
				<Label text="This is Panel 2"  />
			</Slides:Slide>
			<Slides:Slide class="slide-3">
				<Label text="This is Panel 3"  />
			</Slides:Slide>
			<Slides:Slide class="slide-4">
				<Label text="This is Panel 4"  />
			</Slides:Slide>
			<Slides:Slide class="slide-5">
				<Label text="This is Panel 5"  />
			</Slides:Slide>
	</Slides:SlideContainer>

```
### CSS
```css
.slide-1{
  background-color: darkslateblue;
}

.slide-2{
  background-color: darkcyan;
}
.slide-3{
  background-color: darkgreen;
}

.slide-4{
  background-color: darkgoldenrod;
}
.slide-5{
  background-color: darkslategray;
}
Label{
  text-align: center;
  width: 100%;
  font-size: 35;
  margin-top: 35;
}

```
Great for Intros/Tutorials to Image Carousels.

To use the intro slide plugin you need to first import it into your xml layout with  `xmlns:Slides="nativescript-slides"`

when using the intro slide plugin you need at least two ``<Slides:Slide>`` views inside of the ``<Slides:SlideContainer>``.

add as many ``<Slides:Slide>`` as you want.

### Methods for SlideContainer

- **nextSlide()** - navigate to the next slide (right direction)
- **previousSlide()** - navigate to the previous slide (left direction)

### Attributes for SlideContainer

-  **loop : boolean** - If true will cause the slide to be an endless loop. The suggested use case would be for a Image Carousel or something of that nature.

- **velocityScrolling : boolean** - If true will calculate transitions speeds based on the finger movement speed.

- **pageIndicators : boolean** - If true adds indicator dots to the bottom of your slides.

- **indicatorsColor : string** -  color of the indicator dots.

- **interval : integer** -  value is in milliseconds. The suggested use case would be for a Image Carousel or something of that nature which can change the image for every fixed intervals. In unloaded function call `page.getViewById("your_id").stopSlideshow()` to unregister it (your_id is the id given to `<Slides:SlideContainer>`), it can be restarted with `startSlidShow`.

- **disablePan : boolean** - If true panning is disabled. So that you can call nextSlide()/previousSlide() functions to change the slide. If slides is used to get details about users like email, phone number, username etc. in this case you don't want users to move from one slide to another slide without filling details.

- **pagerOffset : string** - Margin-top for the pager.  Number or percentage, default 88%.

#### Events
- **start** - Start pan
- **changed** - Transition complete
- **cancelled** - User didn't complete the transition, or at start\end with no slides
- **finished** - Last slide has come into view

#### Angular 2 compatibility
To use the slides with Angular2 and the `registerElement` from `nativescript-angular` you will want to set the `SlideContainer`'s property of `angular` to `true`. Then in your angular component in the `ngAfterViewInit`. you will want to have an instance of your slide container to call the function `constructView()`.
[Follow the example](https://github.com/TheOriginalJosh/nativescript-slides/issues/37#issuecomment-224820901)

#### Android Optional Attributes
- **androidTranslucentStatusBar : boolean** - If true the Android status bar will be translucent on devices that support it. (Android sdk >= 19).
- **androidTranslucentNavBar : boolean** - If true the Android navigation bar will be translucent on devices that support it. (Android sdk >= 19).

#### Plugin Development Work Flow:

* Clone repository to your machine.
* Run `npm run setup` to prepare the demo project
* Build with `npm run build`
* Run and deploy to your device or emulator with `npm run demo.android` or `npm run demo.ios`

#### Known issues

  * There apears to be a bug with the loop resulting in bad transitions going right to left.

#### How To: Load slides dynamically
You want to hook into the loaded event of the view and then create your view elements.

[Demo Code](https://github.com/TheOriginalJosh/nativescript-slides/blob/master/demo/app/dynamic-page.xml)
``` xml
<Slides:SlideContainer loaded="onSlideContainerLoaded"
```
``` ts
import * as slides from 'nativescript-slides/nativescript-slides'

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


```

#### Smoother panning on Android (For {N} v2.0.0 and below __only__).

To achieve a much smoother drag on android simply go into the gestures.android.js file in the tns-core-modules here


`/node_modules/tns-core-modules/ui/gestures/gestures.android.js`

and change

```javascript
    CustomPanGestureDetector.prototype.getMotionEventCenter = function (event) {
        var count = event.getPointerCount();
        var res = { x: 0, y: 0 };
        for (var i = 0; i < count; i++) {
            res.x += event.getX(i);
            res.y += event.getY(i);
        }
        res.x /= (count * this.density);
        res.y /= (count * this.density);
        return res;
    };
```

to
```javascript
  CustomPanGestureDetector.prototype.getMotionEventCenter = function (event) {
        var count = event.getPointerCount();
        var res = { x: 0, y: 0 };
        for (var i = 0; i < count; i++) {
            res.x += event.getRawX();
            res.y += event.getRawY();
        }
        res.x /= (count * this.density);
        res.y /= (count * this.density);
        return res;
    };
```

_please note this will change the panning gesture for your entire project._


### Thanks to these awesome contributors!

[Brad Martin](https://github.com/bradmartin)

[Obsessive Inc/Abhijith Reddy](https://github.com/Obsessive)

[Victor Nascimento](https://github.com/vjoao)

[Steve McNiven-Scott](https://github.com/sitefinitysteve)

And thanks to [Nathan Walker](https://github.com/NathanWalker) for setting up the {N} plugin seed that was used to help get this plugin up and running. More info can be found about it here:
https://github.com/NathanWalker/nativescript-plugin-seed

## Contributing guidelines
[Contributing guidelines](https://github.com/TheOriginalJosh/nativescript-swiss-army-knife/blob/master/CONTRIBUTING.md)

## License

[MIT](/LICENSE)

for {N} version 2.0.0+
