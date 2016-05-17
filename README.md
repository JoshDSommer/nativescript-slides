# Nativescript Intro Slides for iOS and Android
###_Not just for intro slides any more! Great for **Image Carousels** too!_ ###

[![Nativescript Intro Slides. Click to Play](https://img.youtube.com/vi/1AatGtPA6J8/0.jpg)](https://www.youtube.com/embed/1AatGtPA6J8)

##Example Usage:
###XML
```xml

	<IntroSlides:IntroSlides>
		<IntroSlides:Slide class="intro-slide-1">
			<Label text="This is Panel 1"  />
		</IntroSlides:Slide>
		<IntroSlides:Slide class="intro-slide-2">
			<Label text="This is Panel 2"  />
		</IntroSlides:Slide>
		<IntroSlides:Slide class="intro-slide-3">
			<Label text="This is Panel 3"  />
		</IntroSlides:Slide>
		<IntroSlides:Slide class="intro-slide-4">
			<Label text="This is Panel 4"  />
		</IntroSlides:Slide>
		<IntroSlides:Slide class="intro-slide-5">
			<Label text="This is Panel 5"  />
		</IntroSlides:Slide>
	</IntroSlides:IntroSlides>

```
###CSS
```css
.intro-slide-1{
  background-color: darkslateblue;
}

.intro-slide-2{
  background-color: darkcyan;
}
.intro-slide-3{
  background-color: darkgreen;
}

.intro-slide-4{
  background-color: darkgoldenrod;
}
.intro-slide-5{
  background-color: darkslategray;
}
Label{
  text-align: center;
  width: 100%;
  font-size: 35;
  margin-top: 35;
}

```

To use the intro slide plugin you need to first import it into your xml layout with  `xmlns:IntroSlides="nativescript-intro-slides"`

when using the intro slide plugin you need at least two ``<IntroSlides:Slide>`` views inside of the ``<IntroSlides:IntroSlides>``.

add as many ``<IntroSlides:Slide>`` as you want.

the `IntroSlides` class also has public `nextSlide` and `previousSlide` functions so you can add your own previous and next buttons as needed.

the `<IntroSlides:IntroSlides>` element also has a property called `loop` which is a boolean value and if set to true will cause the slide to be an endless loop. The suggested use case would be for a Image Carousel or something of that nature.

the `<IntroSlides:IntroSlides>` element also has a property called `interval` which is a integer value and the value is in milliseconds. The suggested use case would be for a Image Carousel or something of that nature which can change the image for every fixed intervals. It also has a function carousel(isenabled,time) if isenabled is true it enables the carousel feature and time sets the interval in millisecond. In unloaded function call carousel(false,0) to unregister it.

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
