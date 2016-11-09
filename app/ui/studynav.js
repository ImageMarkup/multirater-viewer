define("ui/studynav", ["config", "zoomer", "slide", "jquery","raterData", "spx", "d3", "pubsub"], function(config, zoomer, slide, $, raterData, spx, d3, pubsub) {

    var studyName = '';
    var imageName = '';
    var slide = null;
    var selectedRaters = new Array();
    var selectedFeature = null;

    pubsub.subscribe("SLIDE", function(msg, data) {
        slide = data;
    });

    var studyList = {
        view: "combo",
        placeholder: "Select Study",
        id: "study_list",
        options: Object.keys(raterData),
        on: {
            "onChange": function(id) {
                var study = this.getPopup().getBody().getItem(id);
                studyName = study.id;
                var images = $$("image_list").getPopup().getList();
                var featureSetId = raterData[studyName]["FeatureSetId"];
                images.clearAll();
                images.parse(Object.keys(raterData[study.id]["MarkupData"])); 

                $$("feature_list").clearAll();
                
                $.get("https://isic-archive.com:443/api/v1/featureset/" + featureSetId, function(data){
                    $$("feature_list").parse(data.localFeatures);
                });
            }
        }
    };
   
    var imageList = {
        view: "combo",
        placeholder: "Select Image",
        id: "image_list",
        options: [],
        on: {
            "onChange": function(id) {
                $$("raters_list").clearAll();
                var image = this.getPopup().getBody().getItem(id);
                imageName = image.id;
                var raters = Object.keys(raterData[studyName]["MarkupData"][image.id]["raters"]);
                var url = config.BASE_URL + "/resource/search?mode=prefix&types=%5B%22item%22%5D&q=" + imageName + ".jpg";

                //update the slide
                $.get(url).then(function(resource){
                    $.get(config.BASE_URL + "/folder/" + resource.item[0].folderId, function(folder){
                        slide.init(folder);
                    })
                 });

                //add a box for each rater
                var data = []
                $.each(raters, function(index, rater){
                    var raterColor = d3.schemeCategory20[index % 20];
                    var spx = raterData[studyName]["MarkupData"][imageName]["raters"][rater]["meta"]["annotations"];
                    data.push({id: rater, spx: spx, fill: raterColor});
                });
                $$("raters_list").parse(data);
            }
        }
    };
   
    var featureList = {
        view: "datatable",
        id: "feature_list",
        select: "row",
        fillspace: true,
        columns:[
            { id:"id", header:"Features", fillspace: true}
        ],
        on:{
            OnItemClick: function(id){
                selectedFeature = this.getItem(id).id;
                spx.removeOverlay();
                spx.addRaterOverlays(selectedFeature, selectedRaters, slide.spx);
            }
        }
    };

    var tpl = "<span style='background-color:#fill#; border-radius:4px; padding-right:10px;'>&nbsp</span>";
    var userStudyList = {
        view: "datatable",
        id: "raters_list",
        multiselect: true,
        select: "row",
        autoheight: true,
        columns:[
            {id:"id", header: "Raters", fillspace: true},
            {id:"fill", header:"Color", editor:"color", template:tpl, width:30} 
        ],
        on:{
            onItemClick: function(id){
                selectedRaters = new Array()
                $.each(this.getSelectedId(true), function(index, rater){
                    selectedRaters.push($$("raters_list").getItem(rater.id));
                });

                if(selectedFeature != null){
                    spx.removeOverlay();
                    spx.addRaterOverlays(selectedFeature, selectedRaters, slide.spx);
                }
            }
        }
    };

    var studyNav = { 
        id: "study_view_tab", 
        width: 220,
        rows:[studyList, imageList, userStudyList, featureList]
    };

    function availableFeatures(raters){
        var features = new Array();

        
    }

    return {
        view: studyNav
    }
});