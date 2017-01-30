(function($){

		    var getJSONOfAttributes = function(selected, attributes){
		    	var all = [];
		    	$.each(selected, function(i, obj){
		    		var temp = {};
		    		for (var i = 0; i < attributes.length; i ++){
		    			if (obj[attributes[i]]) {
		    				temp[attributes[i]] = obj[attributes[i]];
		    			}
		    			if (obj.dataset[attributes[i]]) {
		    				temp[attributes[i]] = obj.dataset[attributes[i]];
		    			}
		    		}
		    		all.push(temp);
		    	})
		    	return all;
		    }

		    var changeAttrName = function(obj, origName, newName) {
		    	if ( newName != origName ){
			    	obj[newName] = obj[origName];
			    	delete obj[origName];
		    	}
		    	return obj;
		    }

		    var changeAllAttributes = function(arr, origName, newName) {
		    	var newArr = [];
		    	for (var i = 0; i < arr.length; i ++){
		    		newArr.push(changeAttrName(arr[i], origName, newName));
		    	}
		    	return newArr;
		    }

			$.fn.htmljsonify = function(attrs=[], newAttrs=[]){
				var selected = this;
				var json = {}	

				json = getJSONOfAttributes(selected, attrs);

				if (attrs.length === newAttrs.length){
					for (var i = 0; i < attrs.length; i ++){
						json = changeAllAttributes(json, attrs[i], newAttrs[i]);
					}
				}

			    return json;
			}


})(jQuery);