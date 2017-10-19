define("ui/featurenav", ["config", "zoomer", "slide", "jquery","raterData"], function(config, zoomer, slide, $, raterData) {

    var studyName = '';
    var imageName = '';
    var featureButtons = [];
    var featureImages = [];

    var studyList = {
        view: "combo",
        placeholder: "Select Study",
        id: "study_list2",
        options: Object.keys(raterData),
        on: {
            onChange: function(id) {
                studyName = this.getPopup().getBody().getItem(id).id;
                initImageSlider(studyName)
            },
            onAfterRender: webix.once(function(){
                studyName = this.getPopup().getBody().getFirstId();
                imageName = Object.keys(raterData[studyName]["MarkupData"])[0];
                initImageSlider(studyName)
            })
        }
    };


    var featureAccordion = {
        view: "form",
        id: "feature_list1",
        height:"auto",
        scroll: "y",
        elements:[]
    };

    var featureNav = {
        width: 300,
        height: "100%",
        id: "feature_view_tab",
        rows: [
            studyList,
            featureAccordion 
        ]
    };

    var thumbnailsPanel = {
        header: "Thumbnails",
        collapsed: false,
        disabled: false,
        id: "feature_thumbnails",
        body:{
            view: "dataview",
            id: "feature_thumbnails_dataview",
            select: true,
            template: "<div class='webix_strong'>#name#</div><img src='" + config.BASE_URL + "/item/#_id#/tiles/thumbnail'/>",
            type: {
                height: 170,
                width: 200
            }
        }
    };

    /*
    initImageSlider: initialize the image thumbnail panel when a new study is selected
     */
    function initImageSlider(study){
        featureButtons = [];
        var featureSetId = raterData[study]["FeatureSetId"];
        var cols = [];
        var requests = [];
        var thumbnails = [];
        featureImages = [];

        $$('feature_list1').reconstruct();

        $.each(raterData[study]["MarkupData"], function(image, raters){
            $.each(raters["raters"], function(raterName, meta){
                $.each(meta["meta"]["annotations"], function(featureName, coords){
                    if(!(featureName in featureImages))
                        featureImages[featureName] = [];

                    if(featureImages[featureName].indexOf(image) == -1)
                        featureImages[featureName].push(image);
                 
                })
            });                    
        });

        //get the list of features for this study using the feature set ID
        $.get("https://isic-archive.com:443/api/v1/featureset/" + featureSetId, function(data){
            if(data.localFeatures.length == 0)
                $$("feature_list1").addView({view: "label", label: "This study has no features!"});

            //for each feature create a button and bind it to the feature_list view (form)
            $.each(data.localFeatures, function(index, feature) {
                count = 0
                
                if(feature.id in featureImages)
                    count = featureImages[feature.id].length;
        
                if(count > 0)
                    disable = false

                btn = {
                    id: feature.id + "_1",
                    view:"button", 
                    width:110, 
                    badge: count, 
                    label: feature.id.replace(new RegExp("[_|/]", 'g'), " "),
                    width:90,
                    height:50,
                    type:"iconTop",
                    css: "feature_button",
                    disabled: disable
                };

                featureButtons.push(btn); 
                cols.push(btn);

                //we want to create 3 columns (a row with 3 buttons)
                if((index+1) % 3 == 0 || index == data.localFeatures.length-1){
                    $$("feature_list1").addView({cols: cols});
                    cols = [];
                }
            });

            $.each(featureButtons, function(idx, btn){
                $$(btn.id).attachEvent("onItemClick", function(id){
                    var thumbnails = [];
                    $$("feature_thumbnails_dataview").clearAll();
                    images = featureImages[btn.id.replace("_1","")];
                    console.log(images);
                    $.each(images, function(idx, image){
                        var url = config.BASE_URL + "/resource/search?mode=prefix&types=%5B%22item%22%5D&q=" + image + ".jpg";
                        requests.push(
                            $.get(url, function(resource){
                                if(resource.item.length > 0)
                                    thumbnails.push(resource.item[0]);
                            })
                        );
                    });
                    
                    //when all the AJAX requests are done processing
                    //populate the image/thumbnail slide/view
                    $.when.apply(null, requests).done(function(){
                        $$("feature_thumbnails_dataview").parse(thumbnails);
                    });
                });
            });
        });
    }

    return {
        view: featureNav,
        accordion: thumbnailsPanel
    }
});
