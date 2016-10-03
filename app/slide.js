define("slide", ["config", "webix"], function(config){

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
			var annotationData = null;
			
			webix.ajax().sync().get(url, function(text, data, xmlHttpRequest){
				annotationData = JSON.parse(text);
			});

			return annotationData;
		}
	}

	return slide;
});