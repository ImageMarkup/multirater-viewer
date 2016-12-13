define("ui/toolbar", ["pubsub", "tiles"], function(pubsub, tiles) {

    var slide = null;
    var spxOn = false;
    pubsub.subscribe("SLIDE", function(msg, data) {
        slide = data;
    });

    buttons = {
        height: 30,
        cols: [{
                id: "apply_filter_btn",
                label: "Apply Filters",
                view: "button",
                click: ("$$('filters_window').show();")
            }, {
                id: "metadata_btn",
                label: "Metadata",
                view: "button",
                click: ("$$('metadata_window').show();")
            }
            /*, {
                id: "spx_btn",
                label: "SPX",
                view: "button",
                disabled: true,
                click: loadSPX
            }*/
        ]
    };

    /*function loadSPX() {
        spxOn = !spxOn;
        spxOn ? tiles.addOverlay(slide.tiles) : tiles.removeOverlay();
    };*/

    return {
        buttons: buttons
    }
});