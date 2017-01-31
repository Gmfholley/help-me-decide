(function($){
/* *****************************
* MIT license
* developer: Wendy Holley (gmfholley)
* allows element's text to be edited
*					type = javascript accepted event type - e.g. click, mouseover, mouseout, focus, etc
*					// options accepted
*					// options.selector = verify original selector applied (instead of child)
*					// options.appendHTML = append HTML after originalTarget in non-edit mode
*					// options.inputClass = class on in the input version of the editable field
*					// options.inputElement = type of input element required
*					// options.inputType = if inputElement = 'input', allows for various types
*					// options.inputStyle = object of css styles
*					// options.inputHoverStyle = object of css styles for on hover
					// callback - executed with access to target element upon click/focusout and the previous value as input.oldValue
*/
// TODO- need to make this work for select, checkbox,and radio buttons

			// returns css as object
			var cssToJSON = function(css) {
			    var style = {};
			    if (!css) return style;

			    if (css instanceof CSSStyleDeclaration) {
			        for (var i in css) {
			        	if (css[i] && css[i].toLowerCase){
			        		// key-value pairs of type CSSStyleDeclaration
		                	style[css[i].toLowerCase()] = (css[css[i]]);
			            }
			        }
			    } else if (typeof css == "string") {
			        css = css.split("; ");
			        for (var i in css) {
			        	// string separated by colon - split and handle as an array
			            var arrStyle = css[i].split(": ");
			            style[arrStyle[0].toLowerCase()] = (arrStyle[1]);
			        }
			    }
			    return style;
			};

			// return the target based on optional selector (might be parent of what was actually clicked)
			var soughtTarget = function (initialTarget, selector){
				var soughtTarget = initialTarget;

				if (selector) {
					var i = 0;
					var firstTarget =  initialTarget;
					while (! soughtTarget.is(selector) && i < 20) {
						soughtTarget = soughtTarget.parent();
						i++;
					}
					// if you could never find the selector, go with the original target
					if (i === 20) { soughtTarget = firstTarget; }
				}

				return soughtTarget;
			}

			var rawInputHtml = function(element, className, type, list=[]) {
				var raw = '';
				switch (element){
					case 'input':
						raw = '<input type="' + type + '" class="' + className + '" />';
						break;
					case 'textarea':
						raw = '<textarea class="' + className + '"><textarea/>';
						break;
					default:
						raw = '<input type="' + type + '" class="' + className + '" />';
				}
				return raw;
			}


			// default Options

			var def = {
				inputElement: 'input',
				inputType: 'text',
				inputClass: 'input-class',
				inputList: [],
				inputStyle: {
						"-webkit-appearance": "textfield", 
						"user-select": "text", 
						"cursor": "auto", 
						"border-width": "2px", 
						"border-style": "inset", 
						"border-color": "initial", 
						"border-image": "initial", 
						"-webkit-rtl-ordering": "logical", 
						"text-rendering": "auto", 
						"-webkit-writing-mode": "horizontal-tb"
					},
				inputHoverStyle: {
					'outline': '-webkit-focus-ring-color auto 5px',
					},
				appendHTML: '',
				selector: null

			}



			$.fn.quickedit = function(type, options={}, callback){
				// don't overwrite def
				var inputOptions = $.extend({}, def, options);

			
				var insertElement = rawInputHtml(inputOptions.inputElement, 
					inputOptions.inputClass, inputOptions.inputType, 
					inputOptions.inputList);


				this.on(type, function(e){

					var finishEdit = function(e) {
						if (typeof callback === 'function') {
							callback(input, inputOptions);
						}
				        origTarget.text($(e.target).val() + ' ')
				        	.append(inputOptions.appendHTML);
				        $(e.target).remove();
					}

					var origTarget = soughtTarget($(e.target), inputOptions.selector);

					// get text and style of element
					var text = origTarget.text().trim();
					var origCss = window.getComputedStyle(origTarget[0], null);

					// insert input element before target, applying text and style some event handling
					if (inputOptions.inputList.length > 0) {
						var input = origTarget.before(insertElement).siblings(inputOptions.inputElement);
					} else {
						var input = origTarget.before(insertElement).prev(inputOptions.inputElement);
					}

					// store original value, in case user wants it in callback
					input.oldValue = text;

					// set text & css, add click event for focus
					// add event handlers with callback to focusout and enter key pressed
					// set focus
					input
						.css(cssToJSON(origCss))
						.css(inputOptions.inputStyle)
						.focus(function(){
							$(this).css(inputOptions.inputHoverStyle);
						})
						.on('keyup', function(e){
							if (e.keyCode === 13) {
								finishEdit(e);
						    }
						})
						.on('focusout', finishEdit)
						.val(text)
						.focus();


					// Delete after css applied
					origTarget.text('');
				});
			};
})(jQuery);

(function(){
	$(document).ready(function(){

		$('.input-allowed').quickedit("click", {selector: '.input-allowed', appendHTML: '<i class="fa fa-edit"></i>', inputElement: 'input', inputType: 'text'});
	});
})(jQuery);