define("ui/studynav", ["config", "zoomer", "slide", "jquery","raterData", "tiles", "d3", "pubsub"], function(config, zoomer, slide, $, raterData, tiles, d3, pubsub) {

    var studyName = '';
    var imageName = '';
    var slide = null;
    var selectedFeature = null;
    var featureButtons = [];

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
                featureButtons = [];

                //get the selected study from the combo box
                var study = this.getPopup().getBody().getItem(id);
                studyName = study.id;
                var featureSetId = raterData[studyName]["FeatureSetId"];
                var cols = [];
                $$("imageDataViewList").clearAll();
                $$("imageDataViewList").parse(Object.keys(raterData[study.id]["MarkupData"]))
                
                //get the list of features for this study using the feature set ID
                $.get("https://isic-archive.com:443/api/v1/featureset/" + featureSetId, function(data){
                    //for each feature create a button and bind it to the feature_list view (form)
                    $.each(data.localFeatures, function(index, feature) {
                        btn = {
                            id: feature.id,
                            view:"button", 
                            width:110, 
                            badge:0, 
                            label: feature.id.replace(new RegExp("[_|/]", 'g'), " "),
                            width:90,
                            height:50,
                            type:"iconTop",
                            css: "feature_button",
                            disabled: true,
                        };

                        featureButtons.push(btn); 
                        cols.push(btn);

                        //we want to create 3 columns (a row with 3 buttons)
                        if((index+1) % 3 == 0 || index == data.localFeatures.length-1){
                            $$("feature_list").addView({cols: cols});
                            cols = [];
                        }
                    });
                });
            }
        }
    };
   
    var imageListDataView = {
        view: "dataview",
        template: "<center><div class='webix_strong'>#id#</div><img src='http://candygram.neurology.emory.edu:8080/api/v1/file/582bcd90f8c2ef30f991ae8c/download?.jpg' height='100'/></center>",
        id: "imageDataViewList",
        xCount:1,
        yCount:1,
        select: true,
        pager: "thumbPager",
        scroll: false,
        css: "thumbnail_cell",
        type: {height: 150, width: 300},
        on: {
            "onItemClick": function(id) {
                //some initialization
                var image = this.getItem(id);
                imageName = image.id;
                var raters = Object.keys(raterData[studyName]["MarkupData"][image.id]["raters"]);
                var url = config.BASE_URL + "/resource/search?mode=prefix&types=%5B%22item%22%5D&q=" + imageName + ".jpg";

                //load the slide
                $.get(url).then(function(resource){
                    $.get(config.BASE_URL + "/folder/" + resource.item[0].folderId, function(folder){
                        slide.init(folder);
                    })
                });

                //for each feature button return the list of raters who marked that image with the given feature
                //this will return array of objects
                featureButtons.map(function(btn){
                    var featureRaters = raters.filter(function(raterName){
                        var annotations = raterData[studyName]["MarkupData"][imageName]["raters"][raterName]["meta"]["annotations"];
                        if(annotations.hasOwnProperty(btn.id) && annotations[btn.id].reduce((x,y) => x+y) > 0)
                            return true;
                    }).map(function(rater, index){
                        return {
                            id:rater, 
                            tiles: raterData[studyName]["MarkupData"][imageName]["raters"][rater]["meta"]["annotations"],
                            fill: d3.schemeCategory20[index % 20]
                        }
                    });

                    //update the badge with the the number of raters
                    $$(btn.id).config.badge = featureRaters.length;

                    //disable and detach click event for the buttons 
                    $$(btn.id).disable();
                    $$(btn.id).detachEvent("onItemClick");
                    
                    //update the onlick event handler for the button
                    if(featureRaters.length > 0){
                        $$(btn.id).enable();
                        $$(btn.id).attachEvent("onItemClick", function(id){
                            tiles.removeOverlay();
                            tiles.addRaterOverlays(id, featureRaters, slide.tiles);
                        });
                    }

                    //finally, refresh the button view
                    $$(btn.id).refresh();
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

    var featureAccordion = {
        view: "form",
        id: "feature_list",
        height:"auto",
        scroll: "y",
        elements:[]
    }

    var studyNav = { 
        id: "study_view_tab", 
        width: 300,
        rows:[studyList, thumbPager, imageListDataView, featureAccordion]
    };

    return {
        view: studyNav
    }
});