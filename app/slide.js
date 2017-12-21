define("slide", ["pubsub", "config", "jquery", "zoomer", "tiles"], function(pubsub, config, $, viewer, tiles) {

    var slide = {
        init: function(item, largeImage) {
	    //console.log(item);
	    //console.log(largeImage);
            $.extend(this, item);
	    //console.log('this', this);
            this.largeImage = largeImage
            tiles.removeOverlay();
            this.viewer();
            this.keyvalue();
            this.initDataViews();
            //this.getTiles();
            pubsub.publish("SLIDE", this);
            return this;
        },

        viewer: function() {
            var url = config.BASE_URL + "/item/"+ this.meta.thumbnailId +"/tiles";
            var itemId = this.meta.thumbnailId;
            var name = this.name;
            var s = this;

            $.get(url).then(function(tile){

                var keyword = name + "_superpixels_v3.0.png.svg.json";
                var url = config.BASE_URL + "/resource/search?mode=prefix&types=%5B%22item%22%5D&q=" + keyword;
                
                //load the slide
                $.get(url).then(function(resource){
                    $.get(config.BASE_URL + "/item/" + resource.item[0]._id + "/files", function(files){
                        $.get(config.BASE_URL + "/file/" + files[0]._id + "/download", function(data){
                            data = JSON.parse(data);
                            s.tiles = tiles.transformCoords(data, tile.sizeX);
                            console.log("Loaded", data.length, "super pixels for", name);
                        })
                    })
                });

                tileSource = {
                    width: tile.sizeX,
                    height: tile.sizeY,
                    tileWidth: tile.tileWidth,
                    tileHeight: tile.tileHeight,
                    minLevel: 0,
                    maxLevel: tile.levels - 1,
                    getTileUrl: function(level, x, y){
                        return config.BASE_URL + "/item/"+ itemId + "/tiles/zxy/" + level + "/" + x + "/" + y + "?edge=crop";
                    }
                }

                viewer.open(tileSource);
            });
        },

        getTiles: function() {
            var keyword = this.name + "_superpixels_v3.0.png.svg.json";
            var url = config.BASE_URL + "/resource/search?mode=prefix&types=%5B%22item%22%5D&q=" + keyword;
            
            //load the slide
            $.get(url).then(function(resource){
                $.get(config.BASE_URL + "/item/" + resource.item[0]._id + "/files", function(files){
                    $.get(config.BASE_URL + "/file/" + files[0]._id + "/download", function(data){
                        data = JSON.parse(data);
                        this.tiles = tiles.transformCoords(data, this.meta.imageWidth);
                        console.log("Loaded", data.length, "super pixels for", this.name);
                    })
                })
            });

            /*$.ajax({
                context: this,
                url: config.BASE_URL + "/file/" + this.meta.svgJsonId + "/download",
                success: function(data) {
                    data = JSON.parse(data);
                    this.tiles = tiles.transformCoords(data, this.meta.imageWidth);
                    console.log("Loaded", data.length, "super pixels for", this.name);
                }
            });*/
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
