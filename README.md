###_The plugin formally known as nativescript-intro-slides_
[![Nativescript Slides. Click to Play](https://img.youtube.com/vi/1AatGtPA6J8/0.jpg)](https://www.youtube.com/embed/1AatGtPA6J8)

##Example Usage:
###XML
```xml

	<Slides:SlideContainer>
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
###CSS
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

the `Slides` class also has public `nextSlide` and `previousSlide` functions so you can add your own previous and next buttons as needed.

the `<Slides:SlideContainer>` element also has a property called `loop` which is a boolean value and if set to true will cause the slide to be an endless loop. The suggested use case would be for a Image Carousel or something of that nature.

###Plugin Development Work Flow:

* Clone repository to your machine.
* Run `npm run setup` to prepare the demo project
* Build with `npm run build`
* Run and deploy to your device or emulator with `npm run demo.android` or `npm run demo.ios`


### Smoother panning on Android.

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


###Special thanks to:
Thanks to [Nathan Walker](https://github.com/NathanWalker) for setting up the {N} plugin seed that I used to help get this plugin up and running. More info can be found about it here:
https://github.com/NathanWalker/nativescript-plugin-seed

##License

[MIT](/LICENSE)

for {N} version 2.0.0+