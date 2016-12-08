define("ui/studynav", ["config", "zoomer", "slide", "jquery","raterData", "tiles", "d3", "pubsub"], function(config, zoomer, slide, $, raterData, tiles, d3, pubsub) {

    var studyName = '';
    var imageName = '';
    var slide = null;
    //var selectedRaters = new Array();
    var selectedFeature = null;
    var featureButtons = [];

    pubsub.subscribe("SLIDE", function(msg, data) {
        slide = data;
        selectedRaters = new Array();
    });

    var studyList = {
        view: "combo",
        placeholder: "Select Study",
        id: "study_list",
        options: Object.keys(raterData),
        on: {
            "onChange": function(id) {
                var cols = [];
                featureButtons = [];

                var study = this.getPopup().getBody().getItem(id);
                studyName = study.id;
                var featureSetId = raterData[studyName]["FeatureSetId"];
                $$("imageDataViewList").clearAll();
                $$("imageDataViewList").parse(Object.keys(raterData[study.id]["MarkupData"]))
                
                $.get("https://isic-archive.com:443/api/v1/featureset/" + featureSetId, function(data){
                    $.each(data.localFeatures, function(index, feature) {
                        btn = {
                            id: feature.id,
                            view:"button", 
                            width:110, 
                            badge:0, 
                            label: feature.name[1] + "<br/>" + feature.name[0],
                            width:90,
                            height:50,
                            type:"iconTop",
                            css: "feature_button",
                            disabled: true,
                        };

                        featureButtons.push(btn); 
                        cols.push(btn);

                        if((index+1) % 2 == 0){
                             $$("feature_list").addView({cols: cols});
                            cols = [];
                        }
                    });
                });
            }
        }
    };

    /*var imageList = {
        view: "combo",
        placeholder: "Select Image",
        id: "image_list",
        options: [],
        on: {
            "onChange": function(id) {
                //$$("raters_list").clearAll();
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
                    data.push({id: rater, tiles: spx, fill: raterColor});
                });
                $$("raters_list").parse(data);


            }
        }
    };*/
   
    var imageListDataView = {
        view: "dataview",
        template: "<center><img src='http://candygram.neurology.emory.edu:8080/api/v1/file/582bcd90f8c2ef30f991ae8c/download?.jpg'/><div class='webix_strong'>#id#</div></center>",
        id: "imageDataViewList",
        xCount:1,
        yCount:1,
        select: true,
        pager: "thumbPager",
        type: {height: 170, width: 220},
        on: {
            "onItemClick": function(id) {
                featureButtons.map(function(btn){
                    $$(btn.id).config.badge = 0;
                    $$(btn.id).disable();
                    $$(btn.id).detachEvent("onItemClick");
                    $$(btn.id).refresh();
                });

                var image = this.getItem(id);
                imageName = image.id;
                var raters = Object.keys(raterData[studyName]["MarkupData"][image.id]["raters"]);
                var url = config.BASE_URL + "/resource/search?mode=prefix&types=%5B%22item%22%5D&q=" + imageName + ".jpg";

                //update the slide
                $.get(url).then(function(resource){
                    $.get(config.BASE_URL + "/folder/" + resource.item[0].folderId, function(folder){
                        slide.init(folder);
                    })
                });

                var data = [];
                $.each(raters, function(index, rater){
                    var ant = raterData[studyName]["MarkupData"][imageName]["raters"][rater]["meta"]["annotations"];
                    
                    $.each(ant, function(feature, tiles){
                        try{
                            $$(feature).config.badge += 1;
                            $$(feature).enable();
                            $$(feature).refresh();
                        }
                        catch(err){
                            console.log(err);
                        }
                    })

                    var raterColor = d3.schemeCategory20[index % 20];
                    var spx = raterData[studyName]["MarkupData"][imageName]["raters"][rater]["meta"]["annotations"];
                    data.push({id: rater, tiles: spx, fill: raterColor});
                });

                featureButtons.map(function(btn){
                    if($$(btn.id).config.badge > 0){
                        $$(btn.id).attachEvent("onItemClick", function(id, e, node){
                            tiles.removeOverlay();
                            tiles.addRaterOverlays(id, data, slide.tiles);
                        });
                    }
                });
            }
        }
    }

    thumbPager = {
            view:"pager",
            id: "thumbPager",
            template: "<center>{common.prev()}{common.page()}/#limit# images{common.next()}</center>",
            animate:true,
            size:1,
            group:1
        }

    /*var imageListDataViewHolder = {
        view: "layout",
        rows: [  imageListDataView]
    }*/

    /*
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
                tiles.removeOverlay();
                tiles.addRaterOverlays(selectedFeature, selectedRaters, slide.tiles);
            }
        }
    };*/

    /*var featureAccordion = {
        view: "accordion",
        id: "feature_accordion",
        multi: false,
        rows: []
    }*/

    var featureAccordion = {
        view: "form",
        id: "feature_list",
        height:"auto",
        scroll: "y",
        elements:[]
    }

    /*var tpl = "<span style='background-color:#fill#; border-radius:4px; padding-right:10px;'>&nbsp</span>";
    var userStudyList = {
        view: "datatable",
        id: "raters_list",
        autoheight: true,
        columns:[
            { id:"rater_ch", header:{ content:"masterCheckbox" }, template:"{common.checkbox()}", width: 30},
            {id:"id", header: "Raters", fillspace: true},
            {id:"fill", header:"", editor:"color", template:tpl, width:30} 
        ],
        on:{
            onCheck: function(raterId, raterBox, state){
                //Source: http://webix.com/snippet/a57f4c5f
                if(state){
                    selectedRaters = $.grep(selectedRaters, function(rater, index){return rater.id == raterId}, true);
                    selectedRaters.push($$("raters_list").getItem(raterId));
                }
                else{
                    selectedRaters = $.grep(selectedRaters, function(rater, index){return rater.id == raterId}, true);
                }

                if(selectedFeature != null){
                    tiles.removeOverlay();
                    tiles.addRaterOverlays(selectedFeature, selectedRaters, slide.tiles);
                }
            }
        }
    };*/

    var studyNav = { 
        id: "study_view_tab", 
        width: 220,
        rows:[studyList, thumbPager, imageListDataView, featureAccordion]
    };

    return {
        view: studyNav
    }
});