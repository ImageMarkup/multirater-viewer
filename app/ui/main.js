define("ui/main", ["ui/header", "ui/slidenav", "ui/slideviewer", "webix"], function(header, slidenav, slideviewer){
	
	function init(){
		webix.ui({
	    	container: "main_layout",
			rows:[
				header.view,
				{
					cols: [
						slidenav.view,
						slideviewer.view
					]
				}
			]
		});
	}

	return{
		init: init
	}
});