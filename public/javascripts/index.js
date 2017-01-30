(function(){

			var saveToken = function() {
				var hash = window.location.pathname.substring(1, window.location.pathname.length);
				var token = document.cookie.substring(6, document.cookie.length);
				if (token) { localStorage.setItem(hash, token); }
			}

			var jsonifyDecison = function(){
				var decision = {}	


			    var filterByAttr = function(arr, attr, val){
			    	var final = [];
			    	for (var i = 0; i < arr.length; i ++){

			    		if (arr[i][attr] && arr[i][attr] == val) {
			    			final.push(arr[i]);
			    		}
			    	}
			    	return final;
			    }

			    var getParentId = function(id) {
			    	return $('#' + id).parent().attr('id');
			    }

			    
			    // use innerHTML for criteria because if it is hidden by css, it will be ''
			    // use innerText for choice because it has font awesome icons in it
			    decision.title = $('#title').text();
			    decision.subtitle = $('#subtitle').text();
			    decision.largeNumbers = $('.large-numbers-button input:checked').val();
			    var choices = $('.choice').htmljsonify(['innerText', 'choice'], ['title', 'id']);
			    var criteria = $('.criteria:not(.new-criteria').htmljsonify(['innerHTML', 'criteria', 'color'], ['title', 'id', 'color']);
			    var priorities = $('.percent').htmljsonify(['innerHTML', 'priority'], ['columnWidth', 'id']);
			    var ranks = $('.rank-choice:checked').htmljsonify(['value', 'choice']);
		


			    for (var i = 0; i < choices.length; i ++){
			    	var thisRank = filterByAttr(ranks, 'choice', choices[i].id);
			    	choices[i].ranks = [];
			    	var temp = {};
			    	for (var j = 0; j < thisRank.length; j ++){
			    		temp[j] = thisRank[j].value;
			    		choices[i].ranks.push(thisRank[j].value);
			    	}
			    }

			    for (var i = 0; i < criteria.length; i ++ ){
			    	criteria[i].parentId = getParentId('criteria-' + criteria[i].id);
			    }

			    decision.choices = choices;
			    decision.criteria = criteria;
			    decision.priorities = priorities;
			    console.log(decision);
			    return decision;
			}

			var postDecision = function() {
				var putUrl = "/api/decisions" + window.location.href.substring(window.location.href.lastIndexOf('/'), window.location.href.length);
				var data = jsonifyDecison();
				var hash = window.location.pathname.substring(1, window.location.pathname.length);
				var token = localStorage.getItem(hash);
				if (token) {
					$.ajax({
						url: putUrl,
						method: 'put',
						data: JSON.stringify(data),
						contentType: 'application/json',
						headers: {
							"Authorization": token
						}


					}).done(function(data){
					});
				} else {
					alert("you are not authorized to save this");
				}
			}

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

			var toggleLargeNumbers = function(){
				$('.large-result').toggleClass('hide-opacity');
			};


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
				square.children('.p-result')[0].innerText = Math.round(square.width() / width * 100 * valueChecked);
				var choice = square.children('.p-result').attr('data-choice');
				var totalRow = 0;
				$('.p-result:not(.decision)[data-choice=' + choice + ']').each(function(){
					totalRow = parseInt(this.innerText) + totalRow;
				})

				$('.decision.p-result[data-choice=' + choice + ']')[0].innerText = totalRow;
			}
			var totalWidth = function(){
				var width = 0;
				$(".computed-width").each(function() {
					width += $(this).width();
				});
				return width;
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
			
			// initialize column Resizable
			$("#decision-maker").colResizable({
				resizeMode:'fit',
				liveDrag:true,
				postbackSafe:true,
				partialRefresh:true,
				draggingClass:"dragging",
				onResize: onSampleResized,
				disabledColumns: [0],
				onDrag: onSampleResized
			});

			$(document).ready(function(){
				// compute initial column widths
				computeWidths();
				calculateAllRanks();
				// add onclick event to cycle color for all criterias
				$('.criteria').click(cycleColor);
				// make all criterias draggable

				$('.new-criteria').off('click', cycleColor);
				$('.new-criteria').on('click', newcriteria);
				$('.all-criterias-show').click(function(e){
					$('.all-criterias').toggleClass('hide');
				});
				$('.large-numbers-button label').click(toggleLargeNumbers);
				$('input[type=radio].rank-choice').change(calculateRank);
				$('#new-row').on('click', addChoice);
				$('.trash-button').click(deleteChoice);
				$('#save-button').click(postDecision);
				saveToken();
			})
})(jQuery);