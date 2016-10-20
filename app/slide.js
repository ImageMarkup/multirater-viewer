define("slide", ["pubsub", "config", "jquery", "zoomer"], function(pubsub, config, $, viewer){

	var slide = {
		init: function(item){
			this.tiles = item.meta.tileInfo;
            this.id = item.meta.slideId;
			this.viewer();

            pubsub.publish("SLIDE", this);
			return this;
		},

		viewer: function(){
            console.log(this);
            itemId = this.id;
            zoom = this.zoom;
            pan = this.pan;
            sharedUrl = config.HOST_URL + "/#item/" + this.id;

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
        }
	}

	return slide;
});