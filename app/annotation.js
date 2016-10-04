define("annotation", ["config", "webix"], function(config){
		
	function data(id){
		var url = config.BASE_URL + "/annotation/" + this.id;
		var annotationData = null;

		webix.ajax().sync.get(url, function(text, data, xmlHttpRequest){
			annotationData = JSON.parse(text);
		});

		return annotationData;
	}

	return{
		data: data
	}
});