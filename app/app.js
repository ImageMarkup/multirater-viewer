define(["routes", "ui", "webix"], function(routes, ui){
	webix.ready(function(){
		ui.init();
		routes.init();
	});
});