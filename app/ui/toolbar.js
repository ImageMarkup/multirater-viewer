define("ui/toolbar", ["pubsub", "spx"], function(pubsub, spx) {

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
            }, {
                id: "hideSVG_btn",
                label: "SPX",
                view: "button",
                click: loadSPX
            }

        ]
    };

    spxTools = {
        height: 30,
        cols: [{
                id: "apply_filter_btn1",
                label: "Apply Filters",
                view: "button"
            }, {
                id: "metadata_btn1",
                label: "Metadata",
                view: "button"
            }

        ]
    };

    function loadSPX() {
        spxOn = !spxOn;
        spxOn ? spx.addOverlay(slide.spx) : spx.removeOverlay();
    }; 

    return {
        buttons: buttons
    }
});