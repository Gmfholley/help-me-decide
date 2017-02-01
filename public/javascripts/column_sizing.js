(function(){
			

			var calculateAllRanks = function() {
				$(".result").each(calculateRank);
			}



			var calculateRank = function(e){
				var width = totalWidth();
				var square = $(this);
				
				var i = 0;
				while (!square.hasClass('result')  && i < 20) {
					square = square.parent();
					i++;
				}
				
				var valueChecked = parseInt(square.children('.rank').children('input:checked').val());

				square.children('.p-result').text(Math.round(square.width() / width * 100 * valueChecked));
				
				var choice = square.children('.p-result').attr('data-choice');
				var totalRow = 0;
				$('.p-result:not(.decision)[data-choice=' + choice + ']').each(function(){
					
					totalRow = parseInt($(this).text()) + totalRow;
				})

				$('.decision.p-result[data-choice=' + choice + ']').text(totalRow);
			}

			// Gets total width in pixels of all columns used in decision
			var totalWidth = function(){
				var width = 0;
				$(".computed-width").each(function() {
					width += $(this).width();
				});
				return width;
			};

			// Sets widths based on .percent innerHTML
			var setWidths = function(){
				var minWidth = Math.max(($(window).width() / 10), 40);
				$('#choice-heading, #final-heading').width(minWidth);
				// cannot trust that sum of all columns = width of table due to margin, border, and browser overflow rules
				width = totalWidth();

				$(".computed-width").each(function() {
					// perc = 32% - remove %, cast as int, divide by 100 to get % and multiply by width
					var perc = $(this).children(".percent").text();
					var percWidth = parseInt(perc.substring(0, perc.length - 1)) / 100 * width;

					// set width of column to width in pixels
					$(this).width(percWidth);
				});
			};			

			// Adds % widths for each column in table with 'computed-width' css classes on headers
			var computeWidths = function(){
				// cannot trust that sum of all columns = width of table due to margin, border, and browser overflow rules
				width = totalWidth();
				$(".computed-width").each(function() {
					$(this).children(".percent").text(String(Math.round($(this).width() / width * 100)) + "%"); 
				});
			};

			//callback for column resizable
			var onSampleResized = function(e){	
				var table = $(e.currentTarget); //reference to the resized table
				computeWidths();
				calculateAllRanks();
			};
			



			$(document).ready(function(){
							// initialize column Resizable

				// compute initial column widths
				setWidths();
				calculateAllRanks();
				
				$('input[type=radio].rank-choice').change(calculateRank);
				
				// set initial widths before setting this to column resizer
				$("#decision-maker").colResizable({
					resizeMode:'fit',
					liveDrag:true,
					draggingClass: 'dragging',
					onResize: onSampleResized,
					disabledColumns: [0],
					onDrag: onSampleResized
				});

			});

})(jQuery);