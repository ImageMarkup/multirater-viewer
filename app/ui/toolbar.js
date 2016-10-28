define("ui/toolbar", ["pubsub"], function(pubsub) {

    var slide = null;
    pubsub.subscribe("SLIDE", function(msg, data) {
        console.log("toolbar SLIDE:", data);
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
        },
        {
            id: "hideSVG_btn",
            label: "Hide SPX",
            view: "button",
            click: loadSPX
        }

        ]
    };

    function loadSPX(){
        console.log("loadSPX", slide.spx);
    };

    return {
        buttons: buttons
    }
});