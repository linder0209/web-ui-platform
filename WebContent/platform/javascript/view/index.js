$(function(){
	
	//定位箭头
	var widthWidth = $('#top_menu li').outerWidth(true),
	    width = $('#top_menu li').width(),
		i = 0;
	$('#top_menu a').each(function(index,element){
		if($(this).hasClass('current')){
			i = index;
			return false;
		}
	});
	
	var arrows = $('#top_menu').next(),
	    left = widthWidth * i + width/2 - arrows.outerWidth()/2;
	arrows.css('left', left + 'px');
	
});