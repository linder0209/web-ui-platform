
/**
 * jQuery plug calculator author : linder
 */
(function($, undefined) {

    $.everbridge.platform.calculator = function(config) {
        this.initDate(config);
    };

    var calculator = $.everbridge.platform.calculator, 
        calculatorP = calculator.prototype;

    jQuery.extend(calculatorP, {
        contactsMax : {},
        
        contactsMap : {},
        
        unitPointPricingMap : {},
        
        foreignExchange : {},
        
        initDate : function(config) {
            var me = this;
            $.ajax({
                url : config.url,
                type: 'GET',
                success : function(data, status, resp) {
                	var json = $.xml2json(data);
                	me.parseData(json['price']);
                	me.parseUnitPointPricingData(json['unit_point_pricing']);
                	me.parseExchange(json['foreign_exchange']);
                	if(config.fn && $.isFunction(config.fn)){
                		config.fn.call(config.scope || window);
                	}
                },
                error: function(xml){
				      console.info('Error loading XML document'+xml);
				},
                dataType : 'xml'
                });
        },
        
        /**
		 * iv interactive_visibility
		  contactsMap = {
			corporate : {
				annualPrice : {
					'100' : 100,
  					....
				},
				iv : {
					'100' : 100,
  					....
				},
				weather : {
					'100' : 100,
  					....
				},
				indexs : [100,200,....]
			},
			education : {
				annualPrice : {
					'100' : 100,
  					....
				},
				iv : {
					'100' : 100,
  					....
				},
				weather : {
					'100' : 100,
  					....
				},
				indexs : [100,200,....]
			},
			govt : {
				annualPrice : {
					'100' : 100,
  					....
				},
				iv : {
					'100' : 100,
  					....
				},
				weather : {
					'100' : 100,
  					....
				},
				indexs : [100,200,....]
			},
			healthcare : {
				annualPrice : {
					'100' : 100,
  					....
				},
				iv : {
					'100' : 100,
  					....
				},
				weather : {
					'100' : 100,
  					....
				},
				indexs : [100,200,....]
			}
		  }
		 **/
        parseData : function(data){
        	var contactsMap = {},
        		price_items,
        		price_item,
        		price_type;
        	
        	for(var item in data){
        		if(item){
        			price_items = data[item];
        			price_item = price_items.price_item;
        			price_type = price_items['price_type'];
        			if(!$.isArray(price_type)){
        				price_type = [price_type];
        			}
        			for (var i = 0, len = price_type.length; i < len; i++) {
		        		contactsMap[price_type[i]] = {
		        			annualPrice : {},
		        			iv : {},
		        			weather : {},
		        			indexs : []//index
		        		};
		        		$(price_item).each(function(index,element){
							contactsMap[price_type[i]]['annualPrice'][element.max] = element[price_type[i]];
							contactsMap[price_type[i]]['iv'][element.max] = element['interactive_visibility'];
							contactsMap[price_type[i]]['weather'][element.max] = element['weather'];
							contactsMap[price_type[i]]['indexs'].push(parseInt(element.max));
			        	});
			        	
			        	this.contactsMax[price_type[i]] = parseInt(price_item[price_item.length - 1].max);
		        	}
        		}
        	}
        	
        	this.contactsMap = contactsMap;
        	
        },
        
        //PREMIUM FEATURES Adjusted Price Per Unit
        parseUnitPointPricingData: function(data){
        	var unitPointPricingMap = {},
        		price_item = data.price_item;
        	unitPointPricingMap['indexs'] = [];//index
        	
        	$(price_item).each(function(index,element){
	        	unitPointPricingMap[element.max] = element.value;
	        	unitPointPricingMap['indexs'].push(parseInt(element.max));
        	});
        	this.unitPointPricingMap = unitPointPricingMap;
        },
        
        //foreign-exchange
        parseExchange : function(data){
           if(!data){
           	  return;
           }
        	var foreignExchange = {};
        	jQuery.each(data,function(key, value){
        		foreignExchange[key] = parseFloat(value);
			});
			this.foreignExchange = foreignExchange;
        },
        
        /**
			find Annual price by vertical and contacts
			@param vertical sort
				Corporate/Financial Vertical
				Healthcare Vertical
				State & Local Gov't
				Education Vertical

			@param contacts
			@param ivOrWeather If the "ivOrWeather" is 'iv', finding in "interactive_visibility";
							If is 'weather', finding in "weather";
		 **/
        findContactsPrice : function(vertical,contacts,ivOrWeather){
        	if(!vertical || !contacts){
        		return 0;
        	}
        	if(!$.everbridge.platform.support.isNumber(contacts)){
        		return 0;
        	}
        	if(vertical == 'financial'){// The corporate and the financial are the same
        		vertical = 'corporate';
        	}
        	var map = this.contactsMap[vertical],
        	    indexs = map.indexs,
        	    find;
        	    
        	find = this.findInNumberArray(indexs,parseInt(contacts));
        	if(find == -1){
        		return 0;
        	}
        	
        	return parseFloat(map[ivOrWeather && typeof ivOrWeather == 'string' ? ivOrWeather : 'annualPrice'][find]);
        },
        
        //ladder price
        // When vertical is State & Local Gov't or Education,calculating value by ladder price
        findContactsLadderPrice : function(vertical,contacts,ivOrWeather){
        	if(!vertical || (vertical != 'education' && vertical != 'govt')){
        		return 0 ;
        	}
        	if(!contacts || !$.everbridge.platform.support.isNumber(contacts)){
        		return 0;
        	}
        	contacts = parseInt(contacts);
        	var map = this.contactsMap[vertical],
        		annualPrice = map[ivOrWeather && typeof ivOrWeather == 'string' ? ivOrWeather : 'annualPrice'],
        	    indexs = map.indexs,
        	    len = indexs.length,
        	    ladderPrice = 0,
        	    ladderNum = len - 1,
        	    annualPriceNum = len - 1;
        	
    	    if(contacts > indexs[0]){
    	    	for (var i = 0; i < len; i++) {
					if(contacts <= indexs[i]){
						ladderNum = i - 1;
						annualPriceNum = i;
						break;
					}
					ladderPrice += (i == 0 ? indexs[i] : (indexs[i] - indexs[i - 1])) * annualPrice[indexs[i]];
	            }
	            ladderPrice += (contacts - indexs[ladderNum]) * annualPrice[indexs[annualPriceNum]];
    	    }else{
    	    	ladderPrice = contacts * annualPrice[indexs[0]];
    	    }
	            
            return ladderPrice;
        },
        
        findMaxContactsPrice : function(vertical,isIV){
        	if(!vertical){
        		return 0;
        	}
        	var map = this.contactsMap[vertical],
        		indexs = map.indexs,
        		len = indexs.length;
        	
        	return parseFloat(map[!isIV ? 'annualPrice' : 'iv'][indexs[len-1]]);
        },
        
        findUnitPointPricing : function(quantity){
        	if(!quantity){
        		return 0;
        	}
        	if(!$.everbridge.platform.support.isNumber(quantity)){
        		return 0;
        	}
        	var map = this.unitPointPricingMap,
        	    indexs = map.indexs,
        	    find;
        	    
        	find = this.findInNumberArray(indexs, parseInt(quantity));
        	if(find == -1){
        		return 0;
        	}
        	return parseFloat(map[find]);
        },
        
        findInNumberArray : function(array, value){
        	if(!$.isArray(array)){
        		return -1;
        	}
        	if(value <= 0 ){
        		return -1;
        	}
        	var find = -1,
        		len = array.length;
        	if(value <= array[0]){
        		find = array[0];
        	}else if(value >= array[len - 1]){
        		find = array[len - 1];
        	}else{
        		for(var i = 0; i < len - 1; i++){
	        		if(value > array[i] && value <= array[i + 1]){
	        			find = array[i + 1];
	        			break;
	        		}
        		}
        	}
        	return find;
        }
        
    });

})(jQuery);
