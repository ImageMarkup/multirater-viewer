define("ui/studynav", ["config", "zoomer", "slide", "jquery","raterData", "spx", "d3", "pubsub"], function(config, zoomer, slide, $, raterData, spx, d3, pubsub) {

    var studyName = '';
    var imageName = '';
    var slide = null;
  
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
                images.clearAll();
                images.parse(Object.keys(raterData[study.id])); 

                $$("feature_list").clearAll();
             
                $.get("https://isic-archive.com:443/api/v1/featureset/55c3d24c9fc3c149ba6470e1", function(data){
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
                var raters = Object.keys(raterData[studyName][image.id]["raters"]);
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
                    var spx = raterData[studyName][imageName]["raters"][rater]["meta"]["annotations"]["starburst_pattern"];
                    data.push({id: rater, name: rater, spx: spx, color: raterColor, $cellCss:{color: {"background-color": raterColor}}});
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
                feature = this.getItem(id).id;
                spx.addRaterOverlays(feature, raterData[studyName][imageName]["raters"], slide.spx);
            }
        }
    };

    var userStudyList = {
        view: "datatable",
        id: "raters_list",
        autoheight: true,
        columns:[
            {id:"name", header: "Raters", fillspace: true},
            {id:"color", header: "Color", width: 50}   
        ]
    };

    var studyNav = { 
        id: "study_view_tab", 
        width: 220,
        rows:[studyList, imageList, userStudyList, featureList]
    };

    return {
        view: studyNav
    }
});