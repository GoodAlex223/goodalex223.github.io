# [Mozilla splash page](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Mozilla_splash_page)

__Objective__: To test knowledge around embedding images and video in web pages, frames, and HTML responsive image techniques.

## Starting point

To start off this assessment, you need to grab the HTML and all the images available in the [mdn-splash-page-start](https://github.com/mdn/learning-area/tree/main/html/multimedia-and-embedding/mdn-splash-page-start) directory on github. Save the contents of index.html in a file called [index.html](https://github.com/mdn/learning-area/blob/main/html/multimedia-and-embedding/mdn-splash-page-start/index.html) on your local drive, in a new directory. Then save [pattern.png](https://github.com/mdn/learning-area/blob/main/html/multimedia-and-embedding/mdn-splash-page-start/pattern.png) in the same directory (right click on the image to get an option to save it.)

Access the different images in the [originals](https://github.com/mdn/learning-area/tree/main/html/multimedia-and-embedding/mdn-splash-page-start/originals) directory and save them in the same way; you'll want to save them in a different directory for now, as you'll need to manipulate (some of) them using a graphics editor before they're ready to be used.

## Project brief

In this assessment we are presenting you with a mostly-finished Mozilla splash page, which aims to say something nice and interesting about what Mozilla stands for, and provide some links to further resources. Unfortunately, no images or video have been added yet — this is your job! You need to add some media to make the page look nice and make more sense. The following subsections detail what you need to do:

### Preparing images

Using your favorite image editor, create 400px wide and 120px wide versions of:

* firefox_logo-only_RGB.png
* firefox-addons.jpg
* mozilla-dinosaur-head.png

Call them something sensible, e.g. firefoxlogo400.png and firefoxlogo120.png.

Along with mdn.svg, these images will be your icons to link to further resources, inside the further-info area. You'll also link to the Firefox logo in the site header. Save copies of all these inside the same directory as index.html.

Next, create a 1200px wide landscape version of red-panda.jpg, and a 600px wide portrait version that shows the panda in more of a close up shot. Again, call them something sensible so you can easily identify them. Save a copy of both of these inside the same directory as index.html.

__Note__: You should optimize your JPG and PNG images to make them as small as possible, while still looking OK. [tinypng.com](https://tinypng.com/) is a great service for doing this easily.

### Adding a logo to the header

Inside the `<header>` element, add an `<img>` element that will embed the small version of the Firefox logo in the header.

### Adding a video to the main article content

Just inside the `<article>` element (right below the opening tag), embed the YouTube video found at [https://www.youtube.com/watch?v=ojcNcvb1olg](https://www.youtube.com/watch?v=ojcNcvb1olg), using the appropriate YouTube tools to generate the code. The video should be 400px wide.

### Adding responsive images to the further info links

Inside the `<div>` with the class of further-info you will find four `<a>` elements — each one linking to an interesting Mozilla-related page. To complete this section you'll need to insert an `<img>` element inside each one containing appropriate src, alt, srcset and sizes attributes.

In each case (except one — which one is inherently responsive?) we want the browser to serve the 120px wide version when the viewport width is 500px wide or less, or the 400px wide version otherwise.

Make sure you match the correct images with the correct links!

__Note__: To properly test the srcset/sizes examples, you'll need to upload your site to a server (using GitHub pages is an easy and free solution), then from there you can test whether they are working properly using browser developer tools such as the Firefox Network Monitor.

### An art directed red panda

Inside the `<div>` with the class of red-panda, we want to insert a `<picture>` element that serves the small portrait panda image if the viewport is 600px wide or less, and the large landscape image otherwise.

## Expected result

![Expected result of mozilla-splash-page project, screen 1](imgs\mozilla-splash-page-expected1.png)
![Expected result of mozilla-splash-page project, screen 2](imgs\mozilla-splash-page-expected2png.png)

## My result

![My result of mozilla-splash-page project, screen 1](imgs\mozilla-splash-page-result1.png)
![My result of mozilla-splash-page project, screen 2](imgs\mozilla-splash-page-result2.png)

## [Live result](https://goodalex223.github.io/MDN/mozilla-splash-page/index.html)
