define("slide", ["config", "annotation", "jquery", "webix"], function(config, annotation, $){

	var slide = {
		id: null,

		init: function(id){
			this.id = id;
			return this;
		},

		data: function(){
			var url = config.BASE_URL + "/image/" + this.id;
			var slideData = null;

			webix.ajax().sync().get(url, function(text, data, xmlHttpRequest){
	        	slideData = JSON.parse(text);
	        });

	        return slideData;
		},

		annotations: function(){
			var url = config.BASE_URL + "/annotation?imageId=" + this.id + "&studyId=573f11119fc3c132505c0ee7";
			var annotationData = new Array();
			
			webix.ajax().sync().get(url, function(text, data, xmlHttpRequest){
				$.each(JSON.parse(text), function(key, obj){
					var anntUrl = config.BASE_URL + "/annotation/" + obj._id;
					webix.ajax().sync().get(anntUrl, function(text, data, xmlHttpRequest){
						annotationData.push(JSON.parse(text));
					});
				});
			});

			console.log(annotationData);
			return annotationData;
		}
	}

	return slide;
});