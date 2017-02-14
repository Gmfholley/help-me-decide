(function(){




			var toggleLargeNumbers = function(){
				$('.large-result').toggleClass('hide-opacity');
			};



	
			$(document).ready(function(){
				
				$('.large-numbers-button label').click(toggleLargeNumbers);

				// add quick edit to all input allowed
				$('.input-allowed').quickedit("click", {selector: '.input-allowed', appendHTML: '<i class="fa fa-edit"></i>', inputElement: 'input', inputType: 'text'});


					// make all criterias draggable
				$('.criteria:not(.new-criteria)').quickdroppable('draggable', {
					dragAssure: '.criteria',
				});


				// make all priorities droppable
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

				// make all criterias droppable

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