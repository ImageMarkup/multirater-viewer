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
        ]
    };

    return {
        buttons: buttons
    }
});