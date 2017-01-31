(function() {
		var newcriteria = function(e){
	        var lastId = $('.criteria:not(.new-criteria)').length + 1;
	        var newLastId = 'criteria-' + lastId;
			$('<input class="criteria color-1" id="' + newLastId + '"></>')
				.insertBefore(e.target)
				.on('keyup', function(e){
					if (e.keyCode === 13) {
				        var newDec = $(e.target).val();
				        $('<div class="criteria color-1" id="' + e.target.id + '" draggable="true"></div>').insertBefore(e.target);
			        	$('#'+newLastId).click(cycleColor)
			        		.attr('data-color', 1)
			        		.attr('data-criteria', lastId)
			        		.text(newDec)
			        		.quickdroppable('draggable');
				        $(e.target).remove();
				    }
				});
		}

		//finding a class called color-n, cycles to next class color from 1 to numColors
		var cycleColor = function(e) {
			var numColors = 5;
			var element = $(e.currentTarget);
			var currentColor = parseInt(element.attr("data-color"));
			if (currentColor === numColors){
				var newColor = 1
			} else {
				var newColor = currentColor + 1;
			}
			element.removeClass('color-'+String(currentColor))
					.addClass('color-' + String(newColor))
					.attr('data-color', newColor);
			if (element.parent().attr('data-color')) {
				element.parent().removeClass('color-' + String(currentColor))
					.addClass("color-" + String(newColor))
					.attr('data-color', newColor);
			}
		}

		$(document).ready(function(){
				
				// add onclick event to cycle color for all criterias
				$('.criteria').click(cycleColor);

				$('.new-criteria').off('click', cycleColor);
				$('.new-criteria').on('click', newcriteria);
				$('.all-criterias-show').click(function(e){
					$('.all-criterias').toggleClass('hide');
				});
			

		});

})(jQuery)