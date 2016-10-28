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
        height: 45,
        hidden: true,
        id: "spx_tools",
        cols: [{ 
                view:"slider",
                id: "opacity_slider",
                label:"Opacity",
                labelPosition: "top",
                labelAlign: "center",
                value:"0.1", 
                step: 0.05,
                min:0, 
                max: 1, 
                width: 200,
                on: {
                    "onSliderDrag": apply,
                    "onChange": apply
                }
            },
            { 
                view:"slider",
                id: "stroke_slider",
                label:"Stroke",
                value:"0.001", 
                labelPosition: "top",
                labelAlign: "center",
                step: 0.0000001,
                min:0, 
                max: 0.005, 
                width: 200,
                on: {
                    "onSliderDrag": apply,
                    "onChange": apply
                }
            },
            { 
                view:"colorpicker",
                id: "stroke_colorpicker",
                label:"Stroke color", 
                value:"blue",
                on: {
                    "onChange": apply
                }
            }
        ]
    };

    function loadSPX() {
        spxOn = !spxOn;
        spxOn ? spx.addOverlay(slide.spx) : spx.removeOverlay();
        spxOn ? $$("spx_tools").show() : $$("spx_tools").hide();
    }; 

    function apply(){
        spx.updateOverlay({
            "opacity": $$("opacity_slider").getValue(),
            "stroke-width": $$("stroke_slider").getValue(),
            "stroke": $$("stroke_colorpicker").getValue()
        });
    }

    return {
        buttons: buttons,
        spxTools: spxTools
    }
});