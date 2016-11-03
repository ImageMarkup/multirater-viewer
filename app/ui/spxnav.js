define("ui/spxnav", ["config", "zoomer", "slide", "jquery", "pubsub", "spx"], function(config, zoomer, slide, $, pubsub, spx) {

    var slide = null;
    var spxOn = false;

    pubsub.subscribe("SLIDE", function(msg, data) {
        slide = data;
    });

    var opacitySlider = {
        view: "slider",
        id: "opacity_slider",
        label: "Opacity",
        labelPosition: "top",
        value: "0.1",
        step: 0.05,
        min: 0,
        max: 1,
        width: 200,
        on: {
            "onSliderDrag": apply,
            "onChange": apply
        }
    };

    var strokeSlider = {
        view: "slider",
        id: "stroke_slider",
        label: "Stroke",
        value: "0.001",
        labelPosition: "top",
        step: 0.0000001,
        min: 0,
        max: 0.005,
        width: 200,
        on: {
            "onSliderDrag": apply,
            "onChange": apply
        }
    };

    var colorPicker = {
        view: "colorpicker",
        id: "stroke_colorpicker",
        label: "Stroke color",
        labelPosition: "top",
        value: "blue",
        on: {
            "onChange": apply
        }
    };

    var nav = {
        width: 220,
        header: "Annotations",
        id: "spx_tools",
        collapsed: true,
        body: {
            rows: [
                opacitySlider,
                strokeSlider,
                colorPicker, {}
            ]
        }
    };


    var showSeg = {


        
    }

    function loadSPX() {
        spxOn = !spxOn;
        spxOn ? spx.addOverlay(slide.spx) : spx.removeOverlay();
        spxOn ? $$("spx_tools").show() : $$("spx_tools").hide();
    }

    function apply() {
        spx.updateOverlay({
            "opacity": $$("opacity_slider").getValue(),
            "stroke-width": $$("stroke_slider").getValue(),
            "stroke": $$("stroke_colorpicker").getValue()
        });
    }

    return {
        view: nav
    }
});