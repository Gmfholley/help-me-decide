(function(){
			var addChoice = function() {
				var setChildren = function() {
					if ($(this).attr('id')) {
						var id = $(this).attr('id');
						$(this).attr('id', id.substring(0, id.lastIndexOf("-") + 1) + newChoice);
					}
					if ($(this).attr('data-choice') ) {
						$(this).attr('data-choice', newChoice);
					}
					if ($(this).attr('for') ) {
						var prevFor = $(this).attr('for');
						$(this).attr('for', prevFor.substring(0, prevFor.lastIndexOf("-") + 1) + newChoice);
					}
					if ($(this).attr('name') ) {
						var prevName = $(this).attr('name');
						$(this).attr('name', prevName.substring(0, prevName.lastIndexOf("-") + 1) + newChoice);
					}
					if ($(this).children().length > 0) {
						$(this).children().each(setChildren);
					}
				}

				$('.trash-button').removeClass('disable');
				var newChoice = parseInt($('.choice-row').last().attr('data-choice')) + 1;
				var newRow = $('.choice-row').last().clone().insertAfter($('.choice-row').last());
				newRow.attr('data-choice', newChoice);
				if (newRow.children().length > 0 ) {
					newRow.children().each(setChildren);
				}
				$('.input-allowed').quickedit("click", {selector: '.input-allowed', appendHTML: '<i class="fa fa-edit"></i>', inputElement: 'input', inputType: 'text'});

				$('input[type=radio].rank-choice').change(calculateRank);
				$('.trash-button').click(deleteChoice);

			}	

			var deleteChoice = function (event) {
				var row = $(event.target);
				var i = 0;
				while (! row.hasClass('choice-row') && i < 20) {
					row = row.parent();
					i++;
				}
				if ($('.' + row[0].classList[0]).length > 1){
					row.remove();
				} else {
					$('.trash-button').addClass('disable');
				}
			}
			

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
				$('#new-row').on('click', addChoice);
				$('.trash-button').click(deleteChoice);
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