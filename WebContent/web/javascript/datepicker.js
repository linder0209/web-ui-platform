$(function() {
	$('#demo-config-menu').load('datepicker/index.html .demos-nav', function() {
		$('#demo-config-menu a').each(function() {
			$(this).attr('target', 'demo-frame');
			$(this).click(function() {
				$(this).parents('ul').find('li').removeClass('demo-config-on');
				$(this).parent().addClass('demo-config-on');
				$('#demo-notes').fadeOut();
				loadDemo('datepicker/' + this.getAttribute('href'));
				return false;
			});
		});
	});
	
	
	function loadDemo(path) {
		$.get(path, function(data) {
			var source = data;
			data = data.replace(/<script.*>.*<\/script>/ig,""); // Remove script tags
			data = data.replace(/<\/?link.*>/ig,""); //Remove link tags
			data = data.replace(/<\/?html.*>/ig,""); //Remove html tag
			data = data.replace(/<\/?body.*>/ig,""); //Remove body tag
			data = data.replace(/<\/?head.*>/ig,""); //Remove head tag
			data = data.replace(/<\/?!doctype.*>/ig,""); //Remove doctype
			data = data.replace(/<title.*>.*<\/title>/ig,""); // Remove title tags
			$('#demo-frame').empty().html(data);
			updateDemoSource(source);
		}, "html" );
	}
	
	function updateDemoSource(source) {
			var cleanedSource = source
				.replace(/\x2E\x2E\x2F\x2E\x2E\x2F/g, '');

			$('#demo-source code').empty().text($.trim(cleanedSource));
		}
		
		
	$('h5[source="true"]').click(function(){
		$(this).next().toggle();
		$(this).find('span').toggleClass('collapsed');
	});
	
	loadDemo('datepicker/default.html');
			
});