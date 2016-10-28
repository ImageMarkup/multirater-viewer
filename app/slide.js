define("slide", ["pubsub", "config", "jquery", "zoomer"], function(pubsub, config, $, viewer){

	var slide = {
		init: function(item){
            $.extend(this, item);
			this.viewer();
            this.keyvalue();
            this.initDataViews();
            this.superPixels();
            pubsub.publish("SLIDE", this);
			return this;
		},

		viewer: function(){
            var tileSource = {
                type: 'legacy-image-pyramid',
                levels: [{
                    url: config.BASE_URL + "/file/"+this.meta.slideId+"/download?.jpg",
                    height:  this.meta.imageHeight,
                    width: this.meta.imageWidth
                }]
            };

            viewer.open(tileSource);
        },

	   superPixels: function(){
            console.log("Loading super pixels ...");
            $.ajax({
                context: this,
                url: config.BASE_URL + "/file/"+ this.meta.svgJsonId +"/download", 
                success: function(data){
                    this.spx = JSON.parse(data);
                    console.log("Loaded", this.spx.length, "super pixels");
                }
            });
        },


        keyvalue: function() {
            var metadata = {
                image: [],
                clinical: []
            };

            metadata.image.push({
                key: "Name",
                value: this.name
            });
            metadata.image.push({
                key: "Size",
                value: this.size
            });

            $.each(this.meta, function(key, value) {
                metadata.image.push({
                    key: key,
                    value: value
                });
            });

            this.metadata = metadata;
        },

        initDataViews: function() {
            $$("image_metadata_table").clearAll();
            $$("image_metadata_table").define("data", this.metadata.image);
        }
	}

	return slide;
});
