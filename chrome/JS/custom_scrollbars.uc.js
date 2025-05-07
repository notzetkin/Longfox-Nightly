"use strict";

/* Firefox userChrome.js tweaks - 'Custom Scrollbars' for Firefox
   https://github.com/Aris-t2/CustomJSforFx/blob/master/scripts/custom_scrollbars.uc.js

   Version: 2.0.5 for Firefox 115+
   
   NOTE: 'non-compatible options' from earlier versions were removed

   README
  
   about:config >
       widget.windows.overlay-scrollbars.enabled > false (Windows)
       widget.gtk.overlay-scrollbars.enabled > false (Linux)
   [!] The above preferences have to be set to 'false' for this code to work
 
   [!] STARTUP CACHE HAS TO BE DELETED AFTER EVERY CHANGE!
   -> finding 'startupCache' folder: address bar > about:profiles > Local Directory > Open Folder > startupCache
   -> close Firefox
   -> delete 'startupCache' folders content
 
   Modifying appearance > change values
   - enable/disable options: true <-> false
   - color
     - name: red, blue, transparent 
     - hex code: #33CCFF, #FFF
     - rgb(a): rgba(0,0,255,0.8)
     - hsl(a): hsla(240,100%,50%,0.8)
   - numbers: 1, 2, 3 ... 10, 11, 12 ...
   - opacity: 0.0 to 1.0 e.g. 1.4, 1,75
   - gradients: linear-gradient(direction, color, color, color)
   - gradients example: linear-gradient(to right, blue, #33CCFF, rgba(0,0,255,0.8))
   - predefined gradients: transparent,rgba(255,255,255,0.5),transparent -> transparent,rgba(255,255,255,0.0),transparent
   - no color or no color value -> use "unset"
   - arrow icons
	  - files have to be downloaded from https://github.com/Aris-t2/CustomJSforFx/tree/master/icons
	  - files have to be placed inside 'icons' (sub)folder --> 'chrome\icons'
	  - own svg files can also be used, if they are named up.svg, down.svg, left.svg, right.svg
 
*/

(function() {


  /* General scrollbar settings *******************************************************/

  // default: hide_scrollbars = false
  const hide_scrollbars = false;

  // default: hide_scrollbar_buttons = false
  const hide_scrollbar_buttons = false;

  // default: thin_scrollbars = false / browsers own way to show thin scrollbars
  const thin_scrollbars = false;

  // default: custom_scrollbar_opacity = false
  const custom_scrollbar_opacity = true;

  // default: custom_opacity_value = "1.0"
  const custom_opacity_value = "0.5";


  /* Custom scrollbar settings ("custom_scrollbar_" --> "cs_") ************************/
  
  // default: custom_scrollbars = true
  const custom_scrollbars = true;
  
  // default: custom_scrollbar_arrows = true
  const custom_scrollbar_arrows = true;
  
  // default: custom_scrollbar_arrows_version = 1
  //  1 ==> SVG arrows as code: might not work on some pages
  //  2 ==> SVG arrows as files: files have to be downloaded from
  //        https://github.com/Aris-t2/CustomJSforFx/tree/master/icons
  //        and placed inside 'chrome\icons' folder
  const custom_scrollbar_arrows_version = 1;
  
  // default: custom_scrollbar_arrows_color = "grey"; / # ==> %23 e.g. #33CCFF ==> %2333CCFF
  // only for 'custom_scrollbar_arrows_version = 1'
  const custom_scrollbar_arrows_color = "fieldtext";
  
  // default: cs_thumb_border = 0 / in px
  const cs_thumb_border = 1;
  
  // default: cs_thumb_roundness = 0 / in px
  const cs_thumb_roundness = 6;
 
  // default: cs_buttons_border = 0 / in px
  const cs_buttons_border = 0;

  // default: cs_buttons_roundness = 0 / in px
  const cs_buttons_roundness = 0;

  // default: cs_ignore_color_gradients = false / 'flat' scrollbars
  const cs_ignore_color_gradients = false; 
  

  /* Custom scrollbar colors and gradients ********************************************/
  
  // default: cs_background_color = "#DDDDDD"
  const cs_background_color = "#DDDDDD";

  // default: cs_background_image_vertical = "linear-gradient(to right,transparent,rgba(255,255,255,0.5),transparent)"
  let cs_background_image_vertical = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAyIDIiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9Ii1tb3otZGlhbG9nIi8+PHJlY3QgZmlsbD0iVGhyZWVESGlnaGxpZ2h0IiB4PSIxIiB5PSIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIi8+PHJlY3QgeD0iMSIgeT0iMSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iLW1vei1kaWFsb2ciLz48cmVjdCBmaWxsPSJUaHJlZURIaWdobGlnaHQiIHg9IjAiIHk9IjEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz48L3N2Zz4=";
  
  // default: cs_background_image_horizontal = "linear-gradient(to bottom,transparent,rgba(255,255,255,0.5),transparent)"
  let cs_background_image_horizontal = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAyIDIiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9Ii1tb3otZGlhbG9nIi8+PHJlY3QgZmlsbD0iVGhyZWVESGlnaGxpZ2h0IiB4PSIxIiB5PSIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIi8+PHJlY3QgeD0iMSIgeT0iMSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iLW1vei1kaWFsb2ciLz48cmVjdCBmaWxsPSJUaHJlZURIaWdobGlnaHQiIHg9IjAiIHk9IjEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz48L3N2Zz4=";
  
  // default: cs_corner_background_color = "#DDDDDD" / - corner
  const cs_corner_background_color = "#DDDDDD";
  
  // default: cs_corner_background_image = "linear-gradient(45deg,transparent 30%,rgba(255,255,255,0.5) 50%,transparent 70%),linear-gradient(-45deg,transparent 30%,rgba(255,255,255,0.5) 50%,transparent 70%)"
  let cs_corner_background_image = "linear-gradient(45deg,transparent 30%,rgba(255,255,255,0.5) 50%,transparent 70%),linear-gradient(-45deg,transparent 30%,rgba(255,255,255,0.5) 50%,transparent 70%)";

  // default: cs_thumb_color = "#33CCFF" / thumb/slider
  const cs_thumb_color = "#33CCFF";
  
  // default: cs_thumb_image_vertical = "linear-gradient(to right,transparent,rgba(255,255,255,0.5),transparent)"
  let cs_thumb_image_vertical = "linear-gradient(to right,transparent,rgba(255,255,255,0.5),transparent)"; 
  
  // default: cs_thumb_image_horizontal = "linear-gradient(to bottom,transparent,rgba(255,255,255,0.5),transparent)"
  let cs_thumb_image_horizontal = "linear-gradient(to bottom,transparent,rgba(255,255,255,0.5),transparent)"; 
  
  // default: cs_thumb_hover_color = "#66FFFF"
  const cs_thumb_hover_color = "#66FFFF";
  
  // default: cs_thumb_hover_image_vertical = "linear-gradient(to right,transparent,rgba(255,255,255,0.5),transparent)"
  let cs_thumb_hover_image_vertical = "linear-gradient(to right,transparent,rgba(255,255,255,0.5),transparent)";
  
  // default: cs_thumb_hover_image_horizontal = "linear-gradient(to bottom,transparent,rgba(255,255,255,0.5),transparent)"
  let cs_thumb_hover_image_horizontal = "linear-gradient(to bottom,transparent,rgba(255,255,255,0.5),transparent)";
  
  // default: cs_thumb_border_color = "#33CCFF"
  const cs_thumb_border_color = "#33CCFF";
  
  // default: cs_buttons_color = "#66FFFF" / buttons
  const cs_buttons_color = "#66FFFF";
  
  // default: cs_buttons_image_vertical = "linear-gradient(to right,transparent,rgba(255,255,255,0.5),transparent)"
  let cs_buttons_image_vertical = "linear-gradient(to right,transparent,rgba(255,255,255,0.5),transparent)";

  // default: cs_buttons_image_horizontal = "linear-gradient(to bottom,transparent,rgba(255,255,255,0.5),transparent)"
  let cs_buttons_image_horizontal = "linear-gradient(to bottom,transparent,rgba(255,255,255,0.5),transparent)";
  
  // default: cs_buttons_hover_color = "#33CCFF"
  const cs_buttons_hover_color = "#33CCFF";
  
  // default: cs_buttons_hover_image_vertical = "linear-gradient(to right,transparent,rgba(255,255,255,0.5),transparent)"
  let cs_buttons_hover_image_vertical = "linear-gradient(to right,transparent,rgba(255,255,255,0.5),transparent)";
  
  // default: cs_buttons_hover_image_horizontal = "linear-gradient(to bottom,transparent,rgba(255,255,255,0.5),transparent)"
  let cs_buttons_hover_image_horizontal = "linear-gradient(to bottom,transparent,rgba(255,255,255,0.5),transparent)";
  
  // default: cs_buttons_border_color = "#33CCFF"
  const cs_buttons_border_color = "#33CCFF";


/* ******************************************************************************************** */
/* ******************************************************************************************** */

  let ProfilePathChrome = PathUtils.toFileURI(PathUtils.join(PathUtils.profileDir, 'chrome'));

  // unset background image color gradients -> flat scrollbars
  if(cs_ignore_color_gradients === true)
	cs_background_image_vertical
	= cs_background_image_horizontal
	= cs_corner_background_image
	= cs_thumb_image_vertical
	= cs_thumb_image_horizontal
	= cs_thumb_hover_image_vertical
	= cs_thumb_hover_image_horizontal
	= cs_buttons_image_vertical
	= cs_buttons_image_horizontal
	= cs_buttons_hover_image_vertical
	= cs_buttons_hover_image_horizontal
	= "unset";


  let custom_scrollbars_code='';
  let custom_scrollbar_arrows_code='';
  let hide_scrollbar_buttons_code='';
  let custom_scrollbar_opacity_code='';
  let hide_scrollbars_code='';
  let thin_scrollbars_code='';
  
  if(custom_scrollbars === true)
	custom_scrollbars_code=`
		slider, scrollcorner, scrollbar thumb, scrollbar scrollbarbutton, tooltip {
		  appearance: auto !important;
		  -moz-default-appearance: none !important;
		}
        scrollbar {
		background-color: transparent !important;
		}
		slider {
		  background-color: transparent !important;
		}
		scrollbar[orient="vertical"] slider {
		width: 15px !important;
		  background-image: ${cs_background_image_vertical} repeat !important;
		}
		scrollbar[orient="horizontal"] slider {
		  background-image: ${cs_background_image_horizontal} !important;
		}
		scrollcorner {
		  background-color: -moz-dialog; !important;
		  background-image: none !important;
		}
		scrollbar thumb {
		  background-color: white !important;
		  border: ${cs_thumb_border}px !important;
		}
		scrollbar[orient="vertical"] thumb {
		  min-height: 20px !important;
		  max-width: 13px !important;
		  box-shadow: inset 1px 0px #ccd8ea, inset 2px 1px #8195b2, inset -1px 0px #fdfefe, inset -2px -1px #8195b2 !important;
		  border-top-right-radius: 8px !important;
		  border-bottom-right-radius: 8px !important;
		  background-image: url("data:image/png;base64,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") !important;
	      background-repeat: no-repeat !important;
		  background-position: center !important;
          background-size: 100% 100% !important;
		  }
		  
		scrollbar[orient="horizontal"] thumb {
		  background-image: url("data:image/png;base64,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") !important;
		  background-repeat: no-repeat !important; 
		  box-shadow: inset 0px 1px #ccd8ea, inset 1px 2px #8195b2, inset 0px -1px #fdfefe, inset -1px -2px #8195b2 !important;
          background-size: 100% 100% !important; 
		  min-width: 16px !important;
		  height: 14px !important;
		   border-bottom-left-radius: 8px !important;
		    border-bottom-right-radius: 8px !important;
		}
		scrollbar thumb:hover, scrollbar thumb:active {
		  background-color: -moz-dialog !important;
		}
		scrollbar thumb[orient="vertical"]:hover, scrollbar thumb[orient="vertical"]:active {
		  background-image: none !important;
		}
		scrollbar thumb[orient="horizontal"]:hover, scrollbar thumb[orient="horizontal"]:active {
		  background-image: none !important;
		}
		scrollbar scrollbarbutton {
		  background-color: white !important;
		  border-radius: 0px !important;
		  min-height: 16px !important;
		  max-height: 16px !important;
		  min-width: 16px !important;
		  max-width: 16px !important;
		}
		scrollbarbutton:not(.disabled):hover:active {
	      background-color: white !important;
	      box-shadow: none !important;
		  border: 0px !important;
        }
		scrollbar[orient="vertical"] scrollbarbutton {
		  background-image: ${cs_buttons_image_horizontal} !important;
		}
		scrollbar[orient="horizontal"] scrollbarbutton {
		  background-image: ${cs_buttons_image_horizontal} !important;
		}
		scrollbar scrollbarbutton:hover {
		  background-color: -moz-dialog; !important;
		}
		scrollbar[orient="vertical"] scrollbarbutton:hover {
		  background-color: -moz-dialog; !important;
		}
		scrollbar[orient="horizontal"] scrollbarbutton:hover {
		  background-image: ${cs_buttons_hover_image_horizontal} !important;
		}
		  scrollbar[orient="vertical"] slider {
		 background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAADJViUEAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEaSURBVHgBVVPJgcQwCEM4/Ve2BWwNU8RoLC47/hhzCKEQ/P1/+Czn4zB34HnCxlpuzwKXfNteC/u99tvm7UYzktgXTGfbBj3jwMZAxJAxJdEnWAW6BfbyNxiykSzdm4SxC+C6d2pSKCI7OZk1WlvmhYfIDtRJ685lMUOMCqqqZr7mO/P2YeYf+qhUn8cUqTuI0U/NUdB7NBGMxlI7iNLSacVJM0Y/Tm9ezNKm3yPifJkEuVQPzJEhBXYZJyNFQfNH+e6LTFAJRn5jKThx9vxotU/M7OiqJWmhOMm8ZWYzie99KOSSMLelMXspEujaCczA7PldW/UaCrgpvhhfBmK3eZb9ddJHiVGsUAKeT6Li4cW3qrj7nb9u0vADgHexGQsYM3gAAAAASUVORK5CYII=") !important;
		 background-repeat: no-repeat !important; 
          background-size: 100% 100% !important;	
		 background-color:white !important;
		 padding-right: 2px !important;
		}
		  scrollbar[orient="horizontal"] slider {
		 border-left: 1px solid -moz-dialog !important;
		 border-right: 1px solid white !important;
		 background-image: linear-gradient(180deg, -moz-dialog 0%, white 100%) !important;
		}  

		tooltip {
 			 @media (-moz-platform: windows) {
    			@media not (prefers-contrast) {
		  			background-color: accentcolor !important;
          			background-image: linear-gradient(
						90deg,
						hsl(calc(var(--you-h) - 3), calc(var(--you-s) + 28%), calc(var(--you-l) + 14%)) 0%,
						hsl(calc(var(--you-h) - 1), calc(var(--you-s) - 2%), calc(var(--you-l) + 2%)) 50%,
						hsl(calc(var(--you-h) - 3), calc(var(--you-s) + 28%), calc(var(--you-l) + 14%)) 100%
						) !important;
          			color: HighlightText !important;
         			border-color: accentcolor !important;
		 			box-shadow: inset 1px 1px 5px hsl(var(--you-h), calc(var(--you-s) + 4%), calc(var(--you-l) + 22%)), inset -1px -1px 5px hsl(var(--you-h), calc(var(--you-s) + 4%), calc(var(--you-l) + 22%)) !important;
         			border-radius: 4px;
      			}
    		}
		}

	#sidebar {
      		border-radius: 0px !important;
      		box-shadow: none !important;
      		outline: unset !important;
      		background-color: transparent !important;
      		color: var(--sidebar-text-color);
    	}
		 
	`;
	
  if(custom_scrollbar_arrows === true && custom_scrollbar_arrows_version === 1)
	custom_scrollbar_arrows_code=`
		scrollbar scrollbarbutton {
		  background-repeat: no-repeat !important;
		  background-position: 0px 0px !important;
		}
		scrollbar[orient="vertical"] scrollbarbutton[type="decrement"] {
		   background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHISURBVHgBfVO7ihRREK26t/9NUPEPDETUxEANVnwlBgYKImJooIILrm4kgqCRGvgFghj4ZpdZeqZne6Z7+nWPp7pnmJ5xdwuKqlv31qnqqtNaVA0i5+CcmCgVcytr/n/nqGlCmxQxpmq6AtBP7IPPk4P5gVGrDvXqDqomvdiycgiAVWwaMKh8GNRp18X643VxNZPYutZEaVofQlcAyIXbTw7L67oZjDLE4xmStECalchmVbAhXrzzDCYLSwlzXfiQnXiKvVGO4f4sJJMO4PLd57DPqdhWUda4cm8TvcRl8t+9CVqAJA/xOMfG/RdsP2BWVJjmBbK8bPXqg62VRLPyczfFn0GK3TgL1x++QlnVGKc54mS6okPqrUfbKwD6Y2c/cLr6ePu9XDt7UpI0l7Ksl8vsT5dzf/r6o9w8f6pbw7ffCTbffJAb507IIJ4IByZHia3x5bvPsnHmOPTrr1Hw5ObW20/dZm3bc5ppz+/HL50+1t1/+T6EZz+OGnknxvHO8szD4s57bX3vHf+FlkQaGR8koAWvSTDjeE26enH0uA7eICxZpnxT0xAf9mMQjhF7oEEaSzGm0zSkqvm+rUTi85LA6mHtO/kHsQhld0A5bC4AAAAASUVORK5CYII=") !important;
          background-size: contain !important;
		}
		  
		scrollbar[orient="vertical"] scrollbarbutton[type="decrement"][disabled="true"] {
		  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDE1IDE1Ij4NCgk8cmVjdCBmaWxsPSJUaHJlZURTaGFkb3ciIGhlaWdodD0iMSIgd2lkdGg9IjciIHk9IjgiIHg9IjMiLz48cmVjdCBmaWxsPSJUaHJlZURIaWdobGlnaHQiIHdpZHRoPSI3IiBoZWlnaHQ9IjEiIHk9IjkiIHg9IjQiLz48cmVjdCBmaWxsPSJUaHJlZURTaGFkb3ciIGhlaWdodD0iMSIgd2lkdGg9IjUiIHg9IjQiIHk9IjciLz48cmVjdCBmaWxsPSJUaHJlZURTaGFkb3ciIGhlaWdodD0iMSIgd2lkdGg9IjMiIHk9IjYiIHg9IjUiLz48cmVjdCBmaWxsPSJUaHJlZURTaGFkb3ciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIHk9IjUiIHg9IjYiLz4NCgkNCgkNCjwvc3ZnPg==") !important;
		}
		scrollbar[orient="vertical"] scrollbarbutton[type="increment"] {
		     background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAADJViUEAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAG1SURBVHgBhVPPL8RQEJ55r/+bBPEXuEjEhQMOJMLBxYFEROJKQrIJwYnEhQNOTu4ikWz8WGq3u2vb3e32jZn3usVuMe3rzLzO9820/Yq3dz55WpFSCHyii60HrZAUImoXg73HNVpjN+dMNhAgI1CWDGVp5YACsEBPkc0FrNJAp6we33Rksq8ElBYrtJ4nUdKIlycgj6ODs2suZ5NBBC0huqncvgsknh4dcPFdMaDC6SUsjA/Bi1+DZjMB4uM3E/DxxQ3MjQ0C3j9W7Vjbx+dMMAzlaghxxwARyRB9RHsnV7A4MUKW5+G5RsXXD3r2Q7OweUhxnFBQj4hJqByE9B40Mr+0dUSpGblAsVSnp7cGvVZC4wcRza3vU5IYiloxNaJ2tuY3Dn4AxYMAS+8h+dWmqdRbVGu0aWa1QMYYO0W73aHZtcJ30FfnUjmyHRloqgz8iGLu2qHJlV1bNZX6HrA1eKs4IHc0DhgTvzCTcOeJ5R3q7fY9x3KtZTxRj1WTE4uXqg7+MZEwZipL5Yl/w7rfjtWotf0RugTi8wqhXys8oZK/xOk6B4g5ebYnj9cdF3LY8/KM5BMbsWD8h59hCQAAAABJRU5ErkJggg==") !important;
		   background-size: contain !important;
		}
		scrollbar[orient="vertical"] scrollbarbutton[type="increment"][disabled="true"] {
			background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTUiIHdpZHRoPSIxNSIgdmlld0JveD0iMCAwIDE1IDE1Ij4NCgk8cmVjdCBmaWxsPSJUaHJlZURTaGFkb3ciIGhlaWdodD0iMSIgd2lkdGg9IjciIHg9IjMiIHk9IjUiLz48cmVjdCBmaWxsPSJUaHJlZURIaWdobGlnaHQiIGhlaWdodD0iMSIgd2lkdGg9IjIiIHk9IjYiIHg9IjkiLz48cmVjdCBmaWxsPSJUaHJlZURIaWdobGlnaHQiIGhlaWdodD0iMSIgd2lkdGg9IjIiIHk9IjciIHg9IjgiLz48cmVjdCBmaWxsPSJUaHJlZURIaWdobGlnaHQiIGhlaWdodD0iMSIgd2lkdGg9IjIiIHg9IjciIHk9IjgiLz48cmVjdCBmaWxsPSJUaHJlZURIaWdobGlnaHQiIGhlaWdodD0iMSIgd2lkdGg9IjEiIHg9IjciIHk9IjkiLz48cmVjdCBmaWxsPSJUaHJlZURTaGFkb3ciIGhlaWdodD0iMSIgd2lkdGg9IjUiIHk9IjYiIHg9IjQiLz48cmVjdCBmaWxsPSJUaHJlZURTaGFkb3ciIGhlaWdodD0iMSIgd2lkdGg9IjMiIHg9IjUiIHk9IjciLz48cmVjdCBmaWxsPSJUaHJlZURTaGFkb3ciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIHg9IjYiIHk9IjgiLz4NCgkNCgkNCjwvc3ZnPg==") !important;
		}
		scrollbar[orient="horizontal"] scrollbarbutton[type="decrement"] {
		  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTUiIHdpZHRoPSIxNSIgdmlld0JveD0iMCAwIDE1IDE1Ij4NCgk8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSI3IiB5PSI0IiB4PSI4IiBmaWxsPSJtZW51dGV4dCIvPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjUiIHk9IjUiIHg9IjciIGZpbGw9Im1lbnV0ZXh0Ii8+PHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iMyIgeT0iNiIgeD0iNiIgZmlsbD0ibWVudXRleHQiLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB5PSI3IiB4PSI1IiBmaWxsPSJtZW51dGV4dCIvPg0KCQ0KCQ0KPC9zdmc+") !important;
		}
		scrollbar[orient="horizontal"] scrollbarbutton[type="decrement"][disabled="true"] {
		  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTUiIHdpZHRoPSIxNSIgdmlld0JveD0iMCAwIDE1IDE1Ij4NCgk8cmVjdCBmaWxsPSJUaHJlZURTaGFkb3ciIHdpZHRoPSIxIiBoZWlnaHQ9IjciIHk9IjQiIHg9IjgiLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSI3IiBmaWxsPSJUaHJlZURIaWdobGlnaHQiIHk9IjUiIHg9IjkiLz48cmVjdCBmaWxsPSJUaHJlZURTaGFkb3ciIHdpZHRoPSIxIiBoZWlnaHQ9IjUiIHk9IjUiIHg9IjciLz48cmVjdCBmaWxsPSJUaHJlZURTaGFkb3ciIHdpZHRoPSIxIiBoZWlnaHQ9IjMiIHk9IjYiIHg9IjYiLz48cmVjdCBmaWxsPSJUaHJlZURTaGFkb3ciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIHk9IjciIHg9IjUiLz4NCgkNCgkNCjwvc3ZnPg==") !important;
		}
		scrollbar[orient="horizontal"] scrollbarbutton[type="increment"] {
		  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDE1IDE1Ij4NCgk8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSI3IiB5PSI0IiB4PSI1IiBmaWxsPSJtZW51dGV4dCIvPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjUiIHk9IjUiIHg9IjYiIGZpbGw9Im1lbnV0ZXh0Ii8+PHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iMyIgeT0iNiIgeD0iNyIgZmlsbD0ibWVudXRleHQiLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB5PSI3IiB4PSI4IiBmaWxsPSJtZW51dGV4dCIvPg0KCQ0KCQ0KPC9zdmc+") !important;
		}
		scrollbar[orient="horizontal"] scrollbarbutton[type="increment"][disabled="true"] {
		  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDE1IDE1Ij4NCgk8cmVjdCBmaWxsPSJUaHJlZURTaGFkb3ciIHdpZHRoPSIxIiBoZWlnaHQ9IjciIHk9IjQiIHg9IjUiLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIyIiBmaWxsPSJUaHJlZURIaWdobGlnaHQiIHg9IjYiIHk9IjEwIi8+PHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iMiIgZmlsbD0iVGhyZWVESGlnaGxpZ2h0IiB4PSI3IiB5PSI5Ii8+PHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iMiIgZmlsbD0iVGhyZWVESGlnaGxpZ2h0IiB4PSI4IiB5PSI4Ii8+PHJlY3Qgd2lkdGg9IjEiIGZpbGw9IlRocmVlREhpZ2hsaWdodCIgaGVpZ2h0PSIxIiB5PSI4IiB4PSI5Ii8+PHJlY3QgZmlsbD0iVGhyZWVEU2hhZG93IiB3aWR0aD0iMSIgaGVpZ2h0PSI1IiB5PSI1IiB4PSI2Ii8+PHJlY3QgZmlsbD0iVGhyZWVEU2hhZG93IiB3aWR0aD0iMSIgaGVpZ2h0PSIzIiB5PSI2IiB4PSI3Ii8+PHJlY3QgZmlsbD0iVGhyZWVEU2hhZG93IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB5PSI3IiB4PSI4Ii8+DQoJDQoJDQo8L3N2Zz4=") !important;
		

	`;
  else if(custom_scrollbar_arrows === true && custom_scrollbar_arrows_version === 2)
	custom_scrollbar_arrows_code=`
		scrollbar scrollbarbutton {
		  background-repeat: no-repeat !important;
		  background-position: center center !important;
		}
		scrollbar[orient="vertical"] > scrollbarbutton[type="decrement"] {
		  background-image: url("${ProfilePathChrome}/icons/up.svg") !important;
		}
		scrollbar[orient="vertical"] > scrollbarbutton[type="increment"] {
		  background-image: url("${ProfilePathChrome}/icons/down.svg") !important;
		}
		scrollbar[orient="horizontal"] > scrollbarbutton[type="decrement"] {
		  background-image: url("${ProfilePathChrome}/icons/left.svg") !important;
		}
		scrollbar[orient="horizontal"] > scrollbarbutton[type="increment"] {
		  background-image: url("${ProfilePathChrome}/icons/right.svg") !important;
		}
	`;

  if(hide_scrollbar_buttons === true)
	hide_scrollbar_buttons_code=`
		scrollbar scrollbarbutton {
		  opacity: 0 !important;
		}
		scrollbar[orient="vertical"] scrollbarbutton {
		  min-height: 1px !important;
		  height: 1px !important;
		  max-height: 1px !important;
		}
		scrollbar[orient="horizontal"] scrollbarbutton {
		  min-width: 1px !important;
		  width: 1px !important;
		  max-width: 1px !important;
		}
	`;
	
  if(custom_scrollbar_opacity === true)
	custom_scrollbar_opacity_code=`
		scrollbar {
		  opacity: 0.5 !important;
		}
	`;
  
  if(hide_scrollbars === true)
	hide_scrollbars_code=`
		scrollbar, scrollcorner {
		  display: none !important;
		  visibility: collapse !important;
		}
	`;
  
  if(thin_scrollbars === true)
	thin_scrollbars_code=`
		:root{
		  scrollbar-width: thin !important;
		}
		scrollbar[orient="vertical"] scrollbarbutton {
		  height: 14px !important;
		  width: 7px !important;
		}
		scrollbar[orient="horizontal"] scrollbarbutton {
		  height: 7px !important;
		  width: 14px !important;
		}
	`;


  Components.classes["@mozilla.org/content/style-sheet-service;1"]
    .getService(Components.interfaces.nsIStyleSheetService)
	  .loadAndRegisterSheet(Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(`
		${custom_scrollbars_code}
		${custom_scrollbar_arrows_code}
		${hide_scrollbar_buttons_code}
		${custom_scrollbar_opacity_code}
		${hide_scrollbars_code}
		${thin_scrollbars_code}
  `), null, null),
  Components.classes["@mozilla.org/content/style-sheet-service;1"]
    .getService(Components.interfaces.nsIStyleSheetService).AGENT_SHEET);


})();
