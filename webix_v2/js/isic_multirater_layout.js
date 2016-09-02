// <span class="navbar-right right-side-button navbar-btn btn-sm">Overlay Opacity: <input id="opacity_slider" data-slider-id='op_slider' type="text" data-slider-min="0" data-slider-max="1" data-slider-step="0.05" data-slider-value="0.5"/></span>
// <button id="tile_toggle" class="btn btn-default navbar-right navbar-btn btn-sm ">Hide Overlays</button>
// <button class="btn btn-sm navbar-btn" id="login">Login</button>
// <button class="btn btn-sm navbar-btn" id="register">Register</button>
// <label class="hidden" id="name"></label>
// <button class="btn  hidden" id="logout">Logout</button>
// <button id="tile_toggle" class="btn btn-default navbar-right navbar-btn btn-sm ">Hide Overlays</button>
// <button id="tile_button" class="btn  btn-default navbar-right  navbar-btn btn-sm ">Show superpixels</button>
// <button id="tile_boundaries" class="btn btn-default navbar-right navbar-btn btn-sm">Lsn Boundaries</button>


//             click: function() {


function tileButtonClicked(id) {
    webix.message(id);
    console.log("Tile Button Clicked")
}

function magicClicked(id) {
    webix.message(id)
}

function tileBoundariesClicked(id) {
    webix.message(id);
}

wbxMultiRaterHeader = {
    borderless: true,
    cols: [{
        view: "toolbar",
        height: 100,
        css: "toolbar",
        cols: [
            { view: "template", borderless: true, template: "<img src='images/1920px-MSKCC_logo.jpg' height=90 >", width: 300 },
            {},
            { view: "button", id: "tile_button", value: "Show Superpixels", autowidth: true, disabled: false, click: tileButtonClicked },
            { view: "button", id: "show_magic", value: "Filters", autowidth: true, disabled: false, click: magicClicked },
            { view: "button", id: "tile_boundaries", value: "Tile Boundaries", css: "top_button", click: tileBoundariesClicked }, {
                view: "slider",
                label: "Opacity",
                value: "50",
                min: 0,
                max: 100,
                name: "Opacity",
                on: {
                    onChange: function() {
                        console.log("sliders changing?");
                        // this.define("title", "Final value " + this.getValue());
                        // this.refresh();
                        webix.message(this.getValue());
                    }
                },

            }

            // {view: "template", borderless:true, template: "<img src='http://cancer.digitalslidearchive.net/imgs/Winship_06-2011/Winship_NCI_shortTag/horizontal/jpg_png/Winship_NCI_shortTag_hz_280.png' height='50'/>", width: 160},
        ]
    }]
}

// view: 'template', template: "ISIC Multirater Viewer", height: 50 }
// webix.ui({
//     container:"areaD",
//     view:"toolbar",
//     cols: buttons(48) /*here you specify the parameter you want to 
//                         pass to the function defined later*/
// }); 

// function buttons(size){
//     return  [
//     { view:"button", type:"image"+size,
//         image:"../common/imgs/"+size+"/save.gif", width:size+7},
//     { view:"button", type:"image"+size,
//         image:"../common/imgs/"+size+"/copy.gif", width:size+7}
//     ];
// }



imageSetList = ['ISIC_MSK-1_1', 'ISIC_MSK-2_1', 'ISIC_SONIC_1', 'ISIC_UDA-1_1', 'ISIC_UDA-2_1']

var colours = ['purple', 'blue', 'green', 'navy', 'green', 'navy', 'blue', 'pink', 'orange', 'yellow', 'lime', 'green', 'blue', 'navy', 'black'];
var color_heatmap = ['blue', 'blue', 'yellow', 'orange', 'red'];
var color20 = d3.scale.category20();

wbxImageSets = {
    view: "combo",
    id: 'field_t',
    label: 'Image Sets',
    value: imageSetList[0],
    options: imageSetList
}

/* This is the actual set of images associated with an image set */
wbxImageList = {
    view: "combo",
    id: 'field_t',
    label: 'Image List',
    value: imageSetList[0],
    options: imageSetList
}

wbxNavControlLayout = {
    width: 300,
    type: "space",
    rows: [wbxImageSets, wbxImageList]
}




webix.ready(function() {
    webix.ui({
        container: "multirater_layout",
        id: "wbx_layout",
        type: "space",
        rows: [wbxMultiRaterHeader, {
            cols: [wbxNavControlLayout, {
                content: "osd_viewdiv",
                autoheight: true,
            }, ]
        }]
    })

});


// header = {borderless: true, cols: [{
//            view:"toolbar", height:66, css: "toolbar",
//                cols:[
//                    {view: "template", borderless:true, template: "<img src='img/CDSA_Slide_50.png' height='40'/>", width: 200},
//                    {},
//                    menu,
//                    {view: "template", borderless:true, template: "<img src='http://cancer.digitalslidearchive.net/imgs/Winship_06-2011/Winship_NCI_shortTag/horizontal/jpg_png/Winship_NCI_shortTag_hz_280.png' height='50'/>", width: 160},
//                ]
//            }]
//        
// buttons = {
//           view: "segmented", 
//           value: "nothing", 
//           options:[
//               { id: "apply_filter_btn", value: "Apply Filters"},
//               { id: "report_img_butn", value: "Report Bad Image"},
//               { id: "show_debug_btn", value: "Show Debug Info"},
//               { id: "draw_tools_btn", value: "Draw Tools"},
//               { id: "comment_btn", value: "Comment"},
//               { id: "aperio_import_btn", value: "AperioXML"}
//           ],
//           on:{
//               onAfterTabClick: function(id){
//                   switch(id){
//                       case "apply_filter_btn":
//                           initFiltersWindow();
//                           break;
//                       case "report_img_butn":
//                           reportImage();
//                           break;
//                       case "comment_btn":
//                           initCommentWindow();
//                           break;
//                       case "aperio_import_btn":
//                           importAperioAnnotations();
//                           break;
//                   }
//               }    
//           }
//       };
