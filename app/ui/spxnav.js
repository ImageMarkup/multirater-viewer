define("ui/spxnav", ["config", "zoomer", "slide", "jquery", "pubsub", "tiles"], function(config, zoomer, slide, $, pubsub, tiles) {

    var slide = null;
    var spxOn = false;

    pubsub.subscribe("SLIDE", function(msg, data) {
        slide = data;
        resetControls();
    });

    var opacitySlider = {
        view: "slider",
        id: "opacity_slider",
        label: "Opacity",
        labelPosition: "top",
        value: "0.2",
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

    var strokeColorPicker = {
        view: "colorpicker",
        id: "stroke_colorpicker",
        label: "Stroke color",
        labelPosition: "top",
        value: "blue",
        on: {
            "onChange": apply
        }
    };

    var fillColorPicker = {
        view: "colorpicker",
        id: "fill_colorpicker",
        label: "Fill color",
        labelPosition: "top",
        value: "blue",
        on: {
            "onChange": apply
        }
    };

    var mOpacitySlider = {
        view: "slider",
        id: "m_opacity_slider",
        label: "Opacity",
        labelPosition: "top",
        value: "0.3",
        step: 0.05,
        min: 0,
        max: 1,
        width: 200,
        on: {
            "onSliderDrag": apply,
            "onChange": apply
        }
    };

    var mStrokeSlider = {
        view: "slider",
        id: "m_stroke_slider",
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

    var mColorPicker = {
        view: "colorpicker",
        id: "m_stroke_colorpicker",
        label: "Stroke color",
        labelPosition: "top",
        value: "blue",
        on: {
            "onChange": apply
        }
    };

    var statNav = {
        view: "datatable",
        id: "stats_view_tab",
        height: 320,
        scroll: false,
        columns: [
            {"id": "key", header: "Value", fillspace: true},
            {"id": "value", header: "Count", width: 70}
        ]
    };

   var single_properties = webix.ui({
view: "window",
        head: {
            view: "toolbar",
            margin: -4,
            cols: [{
                view: "label",
                label: "Single Rater Properties"
            }, {
                view: "icon",
                icon: "times-circle",
                click: "$$('single_properties').hide();"
            }]
        },
                 id: "single_properties",
                 position: "center",
                 move: true,
                 body: {rows: [

                opacitySlider,
                strokeSlider,
                strokeColorPicker ]}
   });

   var multi_properties = webix.ui({
view: "window",
        head: {
            view: "toolbar",
            margin: -4,
            cols: [{
                view: "label",
                label: "Multi Rater Properties"
            }, {
                view: "icon",
                icon: "times-circle",
                click: "$$('multi_properties').hide();"
            }]
        },
                 id: "multi_properties",
                 position: "center",
                 move: true,
                 body: {rows: [

                mOpacitySlider,
                mStrokeSlider,
                mColorPicker ]}
   });


    //http://webix.com/snippet/cc1aa754
    var fillTemp = "<span style='background-color:#fill#; border-radius:4px; padding-right:10px;'>&nbsp</span>";
    console.log(fillTemp);
    var nav = {
        width: 220,
        header: "Annotations",
        id: "spx_tools",
        collapsed: false,
        body: {
            rows: [
                statNav,
                {view: "datatable", 
                 id: "raters_list",
                 editable:true,
		 scroll: false,
                 columns:[
                    {id: "id", header: "Rater", fillspace: true},
                    {id: "fill", header: "Color", editor: "color", template: fillTemp, width:70}
                 ],
                 on:{
                    onAfterEditStop:function(state, editor){
                        console.log('editor', editor); console.log('state value ', state.value);
                        if(editor.row == "2 raters")
                            $(".multi_rater_2_boundary").css("fill", state.value);
                        else if(editor.row == "3 raters")
                            $(".multi_rater_3_boundary").css("fill", state.value);
                        else if(editor.row == "4+ raters")
                            $(".multi_rater_4_boundary").css("fill", state.value);
                        else
                            $(".tile_" + editor.row.replace(" ","")).css("fill", state.value);
                    }
                 }
                },
                {view: "button", click:("$$('single_properties').show();"), label: "Single rater properties"},
                {view: "button", click: ("$$('multi_properties').show();"),  label: "Multi rater properties"}
            ]
        }
    };

    function resetControls(){
        $$("opacity_slider").setValue("0.5");
        $$("stroke_slider").setValue("0.0005");
        $$("stroke_colorpicker").setValue("blue");
        $$("m_opacity_slider").setValue("0.7");
        $$("m_stroke_slider").setValue("0.0005");
        $$("m_stroke_colorpicker").setValue("blue");
    }

    function apply() {
        tiles.updateOverlay("boundaryClass", {
            "opacity": $$("opacity_slider").getValue(),
            "stroke-width": $$("stroke_slider").getValue(),
            "stroke": $$("stroke_colorpicker").getValue()
        },{});

        tiles.updateOverlay("multi_rater_2_boundary", {
            "opacity": $$("m_opacity_slider").getValue(),
            "stroke-width": $$("m_stroke_slider").getValue(),
            "stroke": $$("m_stroke_colorpicker").getValue()
        }, {});

        tiles.updateOverlay("multi_rater_3_boundary", {
            "opacity": $$("m_opacity_slider").getValue(),
            "stroke-width": $$("m_stroke_slider").getValue(),
            "stroke": $$("m_stroke_colorpicker").getValue()
        }, {});

        tiles.updateOverlay("multi_rater_4_boundary", {
            "opacity": $$("m_opacity_slider").getValue(),
            "stroke-width": $$("m_stroke_slider").getValue(),
            "stroke": $$("m_stroke_colorpicker").getValue()
        }, {});
    }

    return {
        view: nav
    }
});
