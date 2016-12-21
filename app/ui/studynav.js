define("ui/studynav", ["config", "zoomer", "slide", "jquery","raterData", "tiles", "d3", "pubsub"], function(config, zoomer, slide, $, raterData, tiles, d3, pubsub) {

    var studyName = '';
    var imageName = '';
    var featureButtons = [];

    var studyList = {
        view: "combo",
        placeholder: "Select Study",
        id: "study_list",
        options: Object.keys(raterData),
        on: {
            onChange: function(id) {
                studyName = this.getPopup().getBody().getItem(id).id;
                initImageSlider(studyName);
            },
            onAfterRender: function(){
                studyName = this.getPopup().getBody().getFirstId();
                imageName = Object.keys(raterData[studyName]["MarkupData"])[0];
                initImageSlider(studyName);
            }
        }
    };
   
    var imageListDataView = {
        view: "dataview",
        template: "<center><div class='webix_strong'>#name#</div><img src='http://candygram.neurology.emory.edu:8080/api/v1/item/#_id#/tiles/thumbnail?width=150'/></center>",
        id: "imageDataViewList",
        xCount:1,
        yCount:1,
        pager: "thumbPager",
        scroll: false,
        css: "thumbnail_cell",
        type: {height: 150, width: 300}
    };

    thumbPager = {
        view:"pager",
        id: "thumbPager",
        template: "<center>{common.prev()}{common.page()}/#limit# images{common.next()}</center>",
        animate:true,
        size:1,
        group:1,
        on:{
			onItemClick: function(id, event, node){
                //http://webix.com/snippet/e00b0728
     		 	// delay is necessary for getting the needed page
      			webix.delay(function(){
        			var page = $$("imageDataViewList").getPage();                   
        			var id = $$("imageDataViewList").getIdByIndex(page);
        			imageName = $$("imageDataViewList").getItem(id).name.replace(".jpg", "");
                    selectImage(studyName, imageName);
      			})
    		}
        }
    };

    var featureAccordion = {
        view: "form",
        id: "feature_list",
        height:"auto",
        scroll: "y",
        elements:[]
    };

    var studyNav = { 
        id: "study_view_tab", 
        width: 300,
        rows:[studyList, thumbPager, imageListDataView, featureAccordion]
    };

    function initImageSlider(study){
        featureButtons = [];
        var featureSetId = raterData[study]["FeatureSetId"];
        var cols = [];
        var requests = [];
        var thumbnails = [];
        $$("imageDataViewList").clearAll();

        $.each(Object.keys(raterData[study]["MarkupData"]), function(index, image){
            var url = config.BASE_URL + "/resource/search?mode=prefix&types=%5B%22item%22%5D&q=" + image + ".jpg";
            requests.push(
                $.get(url, function(resource){
                    thumbnails.push(resource.item[1]);
                })
            );
        });
        
        $.when.apply(null, requests).done(function(){
            $$("imageDataViewList").parse(thumbnails);
        });

        //load the slide
        $$('feature_list').reconstruct();

        //get the list of features for this study using the feature set ID
        $.get("https://isic-archive.com:443/api/v1/featureset/" + featureSetId, function(data){
            if(data.localFeatures.length == 0)
                $$("feature_list").addView({view: "label", label: "This study has no features!"});

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
                    disabled: true
                };

                featureButtons.push(btn); 
                cols.push(btn);

                //we want to create 3 columns (a row with 3 buttons)
                if((index+1) % 3 == 0 || index == data.localFeatures.length-1){
                    $$("feature_list").addView({cols: cols});
                    cols = [];
                }
            });

            selectImage(study, imageName);
        });
    }

    function selectImage(study, image){
        var raters = Object.keys(raterData[study]["MarkupData"][image]["raters"]);
        var url = config.BASE_URL + "/resource/search?mode=prefix&types=%5B%22item%22%5D&q=" + imageName + ".jpg";

        //load the slide
        $.get(url).then(function(resource){
            $.get(config.BASE_URL + "/folder/" + resource.item[0].folderId, function(folder){
                slide.init(folder, resource.item[1]);
            })
        });

        //for each feature button return the list of raters who marked that image with the given feature
        //this will return array of objects
        featureButtons.map(function(btn){
            var featureRaters = raters.filter(
                function(raterName){
                    var annotations = raterData[study]["MarkupData"][image]["raters"][raterName]["meta"]["annotations"];
                    if(annotations.hasOwnProperty(btn.id) && annotations[btn.id].reduce((x,y) => x+y) > 0)
                        return true;
                }).map(
                function(rater, index){
                    return {
                        id:rater, 
                        tiles: raterData[study]["MarkupData"][image]["raters"][rater]["meta"]["annotations"],
                        fill: d3.schemeCategory20[index % 20]
                    }
                });

            //update the badge with the the number of raters
            $$(btn.id).config.badge = featureRaters.length;
            $$(btn.id).define("css", "feature_button");
            $$(btn.id).disable();
            $$(btn.id).detachEvent("onItemClick");
                        
            //update the onlick event handler for the button
            if(featureRaters.length > 0){
                $$(btn.id).enable();
                $$(btn.id).attachEvent("onItemClick", function(id){
                    tiles.removeOverlay();
                    tiles.addRaterOverlays(id, featureRaters, slide.tiles);

                    var tmp = featureRaters;
                    tmp.push({id: "Multi Rater", fill: "red", tiles: {}});
                    $$("raters_list").clearAll();
                    $$("raters_list").parse(featureRaters);
                });
            }

            //finally, refresh the button view
            $$(btn.id).refresh();
        });
    }

    return {
        view: studyNav
    }
});
