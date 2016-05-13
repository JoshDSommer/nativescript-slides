# Nativescript Intro Slides for iOS and Android

[![Nativescript Intro Slides. Click to Play](https://img.youtube.com/vi/5GGGiNA98TU/0.jpg)](https://www.youtube.com/embed/5GGGiNA98TU)

Beta
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
#Usage
To use the intro slide plugin you need to first import it into your xml layout with  `xmlns:IntroSlides="nativescript-intro-slides"`

when using the intro slide plugin you need at least two ``<IntroSlides:Slide>`` views inside of the ``<IntroSlides:IntroSlides>``.

add as many ``<IntroSlides:Slide>`` as you want.

### Planned additions:

* disable/enable previous and next buttons
* Add function and property for button text, for next button on the last slide.
* add properties to override previous and next buttons text.

### Known Issues:
* Breaks on screen rotation. will be fixed.

###Plugin Development Work Flow:

* Clone repository to your machine.
* First run `npm install`
* Then run `npm run setup` to prepare the demo project
* Build with `npm run build`
* Run and deploy to your device or emulator with `npm run demo.android` or `npm run demo.ios`


###Special thanks to:
Thanks to [Nathan Walker](https://github.com/NathanWalker) for setting up the {N} plugin seed that I used to help get this plugin up and running. More info can be found about it here:
https://github.com/NathanWalker/nativescript-plugin-seed

##License

[MIT](/LICENSE)

for {N} version 2.0.0+