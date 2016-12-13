define("slide", ["pubsub", "config", "jquery", "zoomer", "tiles"], function(pubsub, config, $, viewer, tiles) {



    var slide = {
        init: function(item) {
            $.extend(this, item);
            tiles.removeOverlay();
            //$$("spx_tools").collapse();
            //$$("spx_btn").disable();
            this.viewer();
            this.keyvalue();
            this.initDataViews();
            this.getTiles();
            pubsub.publish("SLIDE", this);
            return this;
        },

        viewer: function() {
            var tileSource = {
                type: 'legacy-image-pyramid',
                levels: [{
                    url: config.BASE_URL + "/file/" + this.meta.slideId + "/download?.jpg",
                    height: this.meta.imageHeight,
                    width: this.meta.imageWidth
                }]
            };

            viewer.open(tileSource);
        },

        getTiles: function() {
            $.ajax({
                context: this,
                url: config.BASE_URL + "/file/" + this.meta.svgJsonId + "/download",
                success: function(data) {
                    data = JSON.parse(data);
                    this.tiles = tiles.transformCoords(data, this.meta.imageWidth);
                    console.log("Loaded", data.length, "super pixels for", this.name);
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