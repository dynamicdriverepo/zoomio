# Zoomio- jQuery Image Zoom

**Description:**  **[Zoomio](http://dynamicdrive.com/dynamicindex4/zoomio/)** is an easy to set up, **mobile friendly** Image Zoom script that overlays an enlarged image directly on top of the original image when activated. Users simply mouse over to bring up the enlarged image that can then be explored by moving the mouse around. On mobile devices, users tap the image to bring up the larger image that can then be dragged around.  The zoom function works by taking the original image and showing it in its native dimensions when triggered, meaning the same image is used as both the initial and "enlarged" image. Alternatively, you can specify a different, higher resolution image as the "enlarged" image that's loaded on demand instead.

Zoomio can be called on the same image more than once to take into account any changes to the image, such as after updating the image's `src` property to zoom in on a different image.

## Installation
Refer to demo.htm to see the necessary code to add to the HEAD section of your page as a requirement to start using Zoomio. jQuery 1.7.0 or above is required and referenced in the script.

For npm and bower users, alternatively, run:

    $ npm install zoomio
    $ bower install zoomio

## Setup Information
Zoomio is defined as a jQuery plugin. Simply call the `zoomio()` function on top of the desired image(s) to make them zoomable after the document has loaded:

    jQuery(function($){ // on DOM load
    	$(selector).zoomio()
    })

where selector is a valid jQuery selector selecting one or more images to invoke Zoomio on, such as:

    $('#myimage').zoomio() // add Zoomio to a single image with ID "myimage"
    $('.sampleimage').zoomio() // add Zoomio to all images with CSS class "sampleimage"

For each image, it can consist of just a single image with **large native dimensions** that's scaled down initially using CSS when shown:

    <img class="sampleimage" src="landscape.jpg" />

Or a "thumbnail" image with a `data-largesrc` attribute defined that points to a larger, higher resolution version of itself. In this case the script will dynamically load the larger image on demand when the user mouses over the thumbnail:

    <img class="sampleimage" src="landscapesmall.jpg data-largesrc="landscapelarge.jpg" />

In general the second approach is better, as the large image is only loaded when the user actually zooms in on it. However, it does entail creating another version of each image.

###Supported Options

`$(selector).zoomio()` supports a small list of options you can enter to customize the zoom area interface for the target images:

| Setting        | Description           |
| ------------- |:-------------|
| `fadeduration: milliseconds`      | The duration of the fade in effect, in milliseconds (ie: 1000 = 1 second). |
| `w: widthString`      | The width of the zoom area interface in any desired unit, such as "300px", "80%" etc. By default Zoomio uses the width of the original image as the zoom area's width, creating an overlay that precisely overlaps the original image. |
| `h: heightString` | The height of the zoom area interface in any desired unit, such as "300px", "80%" etc. By default Zoomio uses the height of the original image as the zoom area's height, creating an overlay that precisely overlaps the original image. |
| `scale: int` | Explicitly sets the dimensions of the enlarged image when viewers zoom in on the image, as a multiple of the original thumbnail image's dimensions. A value of 3 for example would set the enlarged image to be 3 times the dimensions of the original thumbnail image shown on the page. |
Example:

    $('#myimage').zoomio({
    	w: '80%',
    	h: '300px' // <-- No comma after last option
    })
##Calling `zoomio()` more than once on the same image

A cool feature of Zoomio is the ability to be called more than once on the same image, to take into account any changes made to the image. The most practical use of this is to update an image's src, then call Zoomio again on the image to make the new image zoomable as well:

    <img id="celebrity" src="josiesmall.jpg" data-largesrc="josie.jpg">
    
    <script>
    
    $('#celebrity').zoomio() // enable Zoomio on this image
    
    function changeImage(imgid, thumbsrc, largesrc){
    	document.getElementById(imgid).src = thumbsrc// update image src
    	document.getElementById(imgid).setAttribute('data-largesrc', largesrc) //  update data-largesrc attribute with large image path
    	$('#celebrity').zoomio() // reinitialize Zoomio on the image
    }
    
    </script>
    
    <button onClick="changeImage('celebrity', 'millasmall.jpg', 'milla.jpg');">Milla</button> 

Since we're making use of the `data-largesrc` attribute to specify a larger version of the original image, when updating it for another image, we need to update both the image's `src` and `data-largesrc` attributes. Otherwise, you should only be modifying the image's `src` property.

Zoomio can also be used to create a simple image gallery where the showcased image can be zoomed in each time. See the **[project page](http://dynamicdrive.com/dynamicindex4/zoomio/)** for more an example of this.