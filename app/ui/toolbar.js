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
                id: "spx_btn",
                label: "SPX",
                view: "button",
                disabled: true,
                click: loadSPX
            }

        ]
    };

    function loadSPX() {
        spxOn = !spxOn;
        spxOn ? spx.addOverlay(slide.spx) : spx.removeOverlay();
        spxOn ? $$("spx_tools").show() : $$("spx_tools").hide();
        $$("spx_tools").expand();
    };

    return {
        buttons: buttons
    }
});