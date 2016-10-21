define("slide", ["pubsub", "config", "jquery", "zoomer"], function(pubsub, config, $, viewer){

	var slide = {
		init: function(item){
			this.tiles = item.meta.tileInfo;
            this.id = item.meta.slideId;
            this.patientFolderId = item._id;
            this.name = item.name;
            this.size = item.size;
			this.viewer();
            this.keyvalue();
            this.initDataViews();
            pubsub.publish("SLIDE", this);
			return this;
		},

		viewer: function(){
            console.log(this);
            itemId = this.id;

            tileSource = {
                width: this.tiles.sizeX,
                height: this.tiles.sizeY,
                tileWidth: this.tiles.tileWidth,
                tileHeight: this.tiles.tileHeight,
                minLevel: 0,
                maxLevel: this.tiles.levels - 1,
                getTileUrl: function(level, x, y) {
                    return config.BASE_URL + "/item/" + itemId + "/tiles/zxy/" + level + "/" + x + "/" + y;
                }
            };

            viewer.open(tileSource);
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

            $.each(this.tiles, function(key, value) {
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