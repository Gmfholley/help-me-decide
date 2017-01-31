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
			$(document).ready(function(){
				
				$('#new-row').on('click', addChoice);
				$('.trash-button').click(deleteChoice);

			})
})(jQuery);