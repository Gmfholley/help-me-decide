(function(){




			var toggleLargeNumbers = function(){
				$('.large-result').toggleClass('hide-opacity');
			};



	
			$(document).ready(function(){
				
				$('.large-numbers-button label').click(toggleLargeNumbers);

			});
})(jQuery);