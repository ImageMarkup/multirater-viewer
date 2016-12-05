define("features", ["jquery"], function($){

	var features = {
		groups: {},

		init: function(data){
			this.data = data;
			this.group();

		},

		group: function(){
			
			console.log(this.data);
		}
	}
		
	return features;
});