# Nativescript Intro Slides for iOS and Android


Beta

Include `xmlns:IntroSlides="nativescript-intro-slides"` in your Page

```xml

	<IntroSlides:IntroSlides>
		<IntroSlides:Slide id="Page1" top="0" left="0">
			<Label text="This is Panel 1"  />
		</IntroSlides:Slide>
		<IntroSlides:Slide id="Page2" top="0" left="0">
			<Label text="This is Panel 2"  />
		</IntroSlides:Slide>
		<IntroSlides:Slide id="Page3" top="0" left="0">
			<Label text="This is Panel 3"  />
		</IntroSlides:Slide>
		<IntroSlides:Slide id="Page4" top="0" left="0">
			<Label text="This is Panel 4"  />
		</IntroSlides:Slide>
		<IntroSlides:Slide id="Page5" top="0" left="0">
			<Label text="This is Panel 5"  />
		</IntroSlides:Slide>
	</IntroSlides:IntroSlides>

```


### Planned additions

* disable/enable previous and next buttons
* Add function and property for button text, for next button on the last slide.
* add properties to override previous and next buttons text.

add as many slides as you want, top down order, minimum of two.

for {N} version 1.7.0+