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
            }, {
                id: "spx_btn",
                label: "SPX",
                view: "button",
                disabled: true,
                click: loadSPX
            },
            {
                id: "showSeg_btn",
                label: "Segs",
                view: "button",
                disabled: false,
                click: loadSeg
            }

        ]
    };

    function loadSeg()
    {
        webix.message("Segs loaded");
        
        console.log(slide);
//         GET /segmentation/{id} Get a segmentation for an image.
// Parameters
// Parameter   Value   Description Parameter Type  Data Type
// id  
// (required)
// The ID of the segmentation. path    string
// Response Messages
// HTTP Status Code    Reason  Response Model
// 400 ID was invalid.
    }

    function getSegmentations()
    {


    }


    function loadSPX() {
        spxOn = !spxOn;
        spxOn ? tiles.addOverlay(slide.tiles) : tiles.removeOverlay();
        spxOn ? $$("spx_tools").show() : $$("spx_tools").hide();
        $$("spx_tools").expand();
    };

    return {
        buttons: buttons
    }
});