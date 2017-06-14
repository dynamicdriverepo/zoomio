// Zoomio jQuery Image Zoom script
// By Dynamic Drive: http://www.dynamicdrive.com
// June 14th 17'- Updated to v2.0.4, which adds:
// 1) Option to specify magnify level inside options. 2) Flag to indicate if images are contained inside a CSS fixed container 3) Changed mobile trigger from "touchstart" to "click"

;(function($){
	var defaults = {fadeduration:500}
	var $zoomiocontainer, $zoomioloadingdiv
	var currentzoominfo = { $zoomimage:null, offset:[,], settings:null, multiplier:[,] }
	var $curimg = $() // variable to reference currently active thumbnail image
	var ismobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) != null //boolean check for popular mobile browsers

	function getDimensions($target){
		return {w:$target.width(), h:$target.height()}
	}

	function getoffset(what, offsettype){ // custom get element offset from document (since jQuery version is whack in mobile browsers
		return (what.offsetParent)? what[offsettype]+getoffset(what.offsetParent, offsettype) : what[offsettype]
	}

	function zoomio($img, settings){ // zoomio plugin function
		var s = settings || defaults
		var trigger = ismobile? 'click' : 'mouseenter'
		$img.off(trigger).on(trigger, function(e){ // on 'click' or 'mouseenter'
			// quick and dirty way to prevent mouseenter over thumbnail from firing again sometimes when $zoomiocontainer fades out while mouse is over thumbnail, leading to retriggering of mouseenter
			if ($zoomiocontainer.css('visibility') == 'visible' && $zoomiocontainer.queue('fx').length ==1 && $curimg == $img){
				return
			}
			$curimg = $img // set current active thumbnail image
			var jqueryevt = e // remember jQuery event object (for use to call e.stopPropagation())
			var e = jqueryevt.originalEvent.changedTouches? jqueryevt.originalEvent.changedTouches[0] : jqueryevt
			var offset
			if (settings.fixedcontainer == true){ // if thumbnail image is wrapped in a fixed element
				var eloffset = $img.offset()
				offset = {left:eloffset.left, top:eloffset.top}
			}
			else{ // use non jQuery method of getting element offsets, which works in older Android chrome browsers
				offset = {left:getoffset($img.get(0), 'offsetLeft'), top:getoffset($img.get(0), 'offsetTop') }
			}
			var mousecoord = [e.pageX - offset.left, e.pageY - offset.top]
			var imgdimensions = getDimensions($img)
			var containerwidth = s.w || imgdimensions.w
			var containerheight = s.h || imgdimensions.h
			$zoomiocontainer.stop().css({visibility: 'hidden'}) // hide loading DIV
			var $zoomimage
			var zoomdfd = $.Deferred()
			var $targetimg = $img.attr('data-largesrc') || $img.data('largesrc') || $img.attr('src')
			if ($img.data('largesrc')){
				$zoomioloadingdiv.css({width:imgdimensions.w, height:imgdimensions.h, left:offset.left, top:offset.top, visibility:'visible', zIndex:10000}) // show loading DIV
			}
			$zoomiocontainer.html( '<img src="' + $targetimg + '">' ) // add image inside zoom container
			$zoomimage = $zoomiocontainer.find('img')
			if ($zoomimage.get(0).complete){
				zoomdfd.resolve()
			}
			else{
				$zoomimage.on('load', function(){
					zoomdfd.resolve()
				})
			}
			zoomdfd.done(function(){
				$zoomiocontainer.css({width:containerwidth, height:containerheight, left:offset.left, top:offset.top}) // set zoom container dimensions and position
				var zoomiocontainerdimensions = getDimensions($zoomiocontainer)
				if (settings.scale){ // v2.03 feature
					$zoomimage.css({width: $img.width() * settings.scale})
				}
				var zoomimgdimensions = getDimensions($zoomimage)
				$zoomioloadingdiv.css({zIndex: 9998})
				$zoomiocontainer.stop().css({visibility:'visible', opacity:0}).animate({opacity:1}, s.fadeduration, function(){
					$zoomioloadingdiv.css({visibility: 'hidden'})
				}) // fade zoom container into view
				if (ismobile){ // scroll to point where user tapped on
					var scrollleftpos = (mousecoord[0] / imgdimensions.w) * (zoomimgdimensions.w - zoomiocontainerdimensions.w)
					var scrolltoppos = (mousecoord[1] / imgdimensions.h) * (zoomimgdimensions.h - zoomiocontainerdimensions.h)
					$zoomiocontainer.scrollLeft( scrollleftpos )
					$zoomiocontainer.scrollTop( scrolltoppos )
				}
				currentzoominfo = {$zoomimage:$zoomimage, offset:offset, settings:s, multiplier:[zoomimgdimensions.w/zoomiocontainerdimensions.w, zoomimgdimensions.h/zoomiocontainerdimensions.h]}
			})

			$img.off('mouseleave').on('mouseleave', function(e){
				if (zoomdfd.state() !='resolved'){ // if enlarged image has loaded yet when user mouses out of original image
					zoomdfd.reject()
					$zoomioloadingdiv.css({visibility: 'hidden'})
				}
			})
			jqueryevt.stopPropagation() // stopPropagation() works on jquery evt object (versus jqueryevt.originalEvent.changedTouches[0]
		})		
	}

	$.fn.zoomio = function(options){ // set up jquery zoomio plugin
		var s = $.extend({}, defaults, options)

		return this.each(function(){ //return jQuery obj
			var $target = $(this)

			$target = ($target.is('img'))? $target : $target.find('img:eq(0)')
			if ($target.length == 0){
				return true
			}
			zoomio($target, s)
		}) // end return this.each

	}

	$(function(){ // on DOM load
		$zoomiocontainer = $('<div id="zoomiocontainer">').appendTo(document.body)
		$zoomioloadingdiv = $('<div id="zoomioloadingdiv"><div class="spinner"></div></div>').appendTo(document.body)
		if (!ismobile){
			$zoomiocontainer.on('mouseenter', function(e){
			})
			$zoomiocontainer.on('mousemove', function(e){
				var $zoomimage = currentzoominfo.$zoomimage
				var imgoffset = currentzoominfo.offset
				var mousecoord = [e.pageX-imgoffset.left, e.pageY-imgoffset.top]
				var multiplier = currentzoominfo.multiplier
				$zoomimage.css({left: -mousecoord[0] * multiplier[0] + mousecoord[0] , top: -mousecoord[1] * multiplier[1] + mousecoord[1]})
			})
			$zoomiocontainer.on('mouseleave', function(){
				$zoomioloadingdiv.css({visibility: 'hidden'})
				$zoomiocontainer.stop().animate({opacity:0}, currentzoominfo.settings.fadeduration, function(){
					$(this).css({visibility:'hidden', left:'-100%', top:'-100%'})
				})
			})
		}
		else{ // is mobile
			$zoomiocontainer.addClass('mobileclass')
			$zoomiocontainer.on('touchstart', function(e){
				e.stopPropagation() // stopPropagation() works on jquery evt object (versus e.originalEvent.changedTouches[0]
			})
			$(document).on('touchstart.dismisszoomio', function(e){
				if (currentzoominfo.$zoomimage){ // if $zoomimage defined
					$zoomioloadingdiv.css({visibility: 'hidden'})
					$zoomiocontainer.stop().animate({opacity:0}, currentzoominfo.settings.fadeduration, function(){
						$(this).css({visibility:'hidden', left:'-100%', top:'-100%'})
					})
				}
			})
		} // end else
	})

})(jQuery);
