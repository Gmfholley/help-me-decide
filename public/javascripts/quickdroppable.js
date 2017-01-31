(function($){

/* *****************************
* MIT license
* developer: Wendy Holley (gmfholley)
* allows html5 draga nd drop interface with touch support
*				type = 'draggable' or 'droppable'
*				options = {
					targetAssure: selector for target - might be parent of what was clicked,
					dropCondition: selector for drop condition,
					insertBefore: selector for insert of dragged into drop,
					dragRemoveClass: class to add to drag/target element,
					dragAddClass: class to remove from drag/target element,
					dropRemoveClass: class to remove from drop element,
					dropAddClass: class to add to drop element
				}
				callback = will be executed before drag/drop event finished

*/
// TODO- need to make this work for select, checkbox,and radio buttons

			// wrapper handler for Touch events to create drag events
			var handleTouch = function(event){
				event.preventDefault();
				var type, dispatchTarget;
				var touch = event.originalEvent.changedTouches[0];
				switch(event.type){
					case "touchstart": 
						type="dragstart"; 
						dispatchTarget = touch.target;
						break;
					case "touchmove": 
						type="drag"; 
						dispatchTarget = touch.target;
						break;
					case "touchend": 
						var dropSite = document.elementFromPoint(touch.clientX, touch.clientY);
						if (dropSite === event.target){
							dispatchTarget = event.target;
							type="click";
						} else {
							dispatchTarget = dropSite;
							type="drop";
						}
						break;
					default: return;
				}

				var simulatedMouse = document.createEvent("MouseEvent");
				//event.initMouseEvent(type, canBubble, cancelable, view,
    //                  detail (clicks), screenX, screenY, clientX, clientY,
    //                  ctrlKey, altKey, shiftKey, metaKey,
    //                  button (0: Main button pressed), relatedTarget);
				simulatedMouse.initMouseEvent(type, true, true, window, 
					1, touch.screenX, touch.screenY, touch.clientX, touch.clientY,
					false, false, false, false, 0, null);
				
				dispatchTarget.dispatchEvent(simulatedMouse);

			}


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

			// assign a unique if the element doesn't already have one
			var assureId = function(jElement) {
				while (! jElement.attr('id')) {
					var tryId = Math.random().toString(36);
					if (! document.getElementById(tryId)){
						jElement.attr('id', tryId);
					}
				}
				return jElement;
			}


			// defaultOptions

			var def = {
				dragAssure: '',
				dropAssure: '',
				dropCondition: '',
				insertBefore: '',
				dragRemoveClass: '',
				dragAddClass: '',
				dropRemoveClass: '',
				dropAddClass: ''
			}

			$.fn.quickdroppable = function(type, options={}, callback){
				
				// don't overwrite def
				var dropOptions = $.extend({}, def, options);


				var dragStart = function(event) {



					var dragTarget = soughtTarget($(event.target), dropOptions.dragAssure);
					assureId(dragTarget);
					
					if (event.dataTransfer){
						event.dataTransfer.setData("text", dragTarget.attr('id'));
					} else {
						jQuery.Event.data = {"text": dragTarget.attr('id')};
					}

					dragTarget.addClass(dropOptions.dragAddClass)
							.removeClass(dropOptions.dragRemoveClass);

					if (typeof callback === 'function') {
						callback(event, dragTarget, dropOptions);
					}
				}

				var dropEvent = function(event){
					event.preventDefault();
				  	event.stopPropagation();


				  	var dropTarget = soughtTarget($(event.target), dropOptions.dropAssure);
				  	
				  	if (event.dataTransfer){
					    var data = event.dataTransfer.getData("text");
				  	} else {
					    var data = jQuery.Event.data["text"];
				  	}

					var dragged = $('#' + data);

					

					if (typeof callback === 'function') {
						callback(event, dropTarget, dragged, dropOptions);
					}
					//priority  = table headers
					//only allow to drop if empty
					if (!dropOptions.dropCondition || dropTarget.is(dropOptions.dropCondition)){
						
						if (dropOptions.insertBefore) {
							dragged.insertBefore(dropOptions.insertBefore)
						} else {
							dragged.insertBefore(dropTarget.children());
						}

						dropTarget.addClass(dropOptions.dropAddClass)
							.removeClass(dropOptions.dropRemoveClass);


	
						
						dragged.addClass(dropOptions.dragAddClass)
							.removeClass(dropOptions.dragRemoveClass);



					}

				}



				if (type === 'droppable') {
					this.on('drop', dropEvent)
						.on('dragover', function(event){
							event.preventDefault();
							event.stopPropagation();
						});
				}

				if (type === 'draggable') {
					this.on('dragstart', dragStart)
						.on('touchstart', handleTouch)
						.on('touchmove', handleTouch)
						.on('touchend', handleTouch)
						.on('touchcancel', handleTouch)
				}
			}

		
})(jQuery);
(function(){
			$(document).ready(function(){
				
				// make all criterias draggable
				$('.criteria:not(.new-criteria').quickdroppable('draggable', {
					dragAssure: '.criteria',
				});

				$('.priority').quickdroppable('droppable', {
					dropAssure: '.priority',
					dropCondition: '.empty',
					dropRemoveClass: 'empty',

				}, function(event, dropTarget, dragged, dropOptions){
					// add color class to priority column
					var currentColor = dragged.attr('data-color');
					
					if (dropTarget.is('.empty')){
						dropTarget
							.addClass('color-' + currentColor)
							.attr('data-color', currentColor);
						if (dragged.parent().is('.priority')) {
							dragged.parent()
								.addClass('empty')
								.removeClass('color-' + currentColor)
								.removeData('color');
						}
					}
				});


				$('.all-criterias').quickdroppable('droppable', {
					dropAssure: '.all-criterias',
					insertBefore: '.new-criteria'
				}, function(event, dropTarget, dragged, dropOptions){
					// add color class to priority column
					var currentColor = dragged.attr('data-color');

					
					if (dragged.parent().is('.priority')) {
						
						dragged.parent()
							.addClass('empty')
							.removeClass('color-' + currentColor)
							.removeData('color');
					} 
				})
				
			});
})(jQuery);
