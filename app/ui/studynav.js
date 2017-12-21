define("ui/studynav", ["config", "zoomer", "slide", "jquery", "raterData", "tiles", "d3", "pubsub", "new_data_flow"], function(config, zoomer, slide, $, raterData, tiles, d3, pubsub) {

    var studyName = '';
    var imageName = '';
    var studyMetadata = '';
    var featureButtons = [];
    var tilesOn = true;
    var studyListOptions = [];
    studyListData = get_study_list(token);
    for (i = 0; i < studyListData.length; i++) {
        studyListOptions.push(studyListData[i]['name']);
    }
    webix.UIManager.addHotKey("Alt+T", function() {
        if (tilesOn) {
            $$("opacity_slider").setValue("0");
            $$("m_opacity_slider").setValue("0");
            tilesOn = false;
        } else {
            $$("opacity_slider").setValue("0.5");
            $$("m_opacity_slider").setValue("0.7");
            tilesOn = true;
        }
    });

    var filter = {
        view: "search",
        id: "thumbnail_search",
        placeholder: "Search",
        on: {
            "onChange": filterSlides
        }
    };

    var studyList = {
        view: "combo",
        placeholder: "Select Study",
        id: "study_list",
        options: studyListOptions, //Object.keys(raterData),
        on: {
            onChange: function(id) {
                studyName = this.getPopup().getBody().getItem(id).id;
                //console.log(studyName);
                imageName = 'a'; //Object.keys(raterData[studyName]["MarkupData"])[0];
                initImageSlider();
            },
            onAfterRender: webix.once(function() {
                studyName = this.getPopup().getBody().getFirstId();
                imageName = 'a'; //Object.keys(raterData[studyName]["MarkupData"])[0];
                initImageSlider();
                this.setValue(studyName);
                //document.getElementById('1509771405631').value = "MSK Practice Study"; //temp
            })
        }
    };

    var imageListDataView = {
        view: "dataview",
        template: "<center><div class='webix_strong'>#name#</div><img src='http://dermannotator.org:8080/api/v1/item/#_id#/tiles/thumbnail?width=150'/><br/>[#numRaters# Raters Annotated This Image]</center>",
        id: "imageDataViewList",
        xCount: 1,
        yCount: 1,
        pager: "thumbPager",
        scroll: false,
        css: "thumbnail_cell",
        type: {
            height: 180,
            width: 300
        },
        on: {
            onChange: function() {
                webix.delay(function() {
                    var f = document.getElementsByClassName('webix_view webix_pager')[0].innerText;
                    var match = /\d+/.exec(f); //console.log('a');
                    document.getElementsByClassName('webix_strong')[0].innerHTML = 'Image ' + match[0];
                    document.getElementsByClassName('webix_strong')[0].innerHTML = 'Image ' + match[0];
                })
            },
            //onAfterRender: function(){webix.delay(function(){document.getElementById('1509771405631').value = "MSK Practice Study";})
            //}
        }
    };

    var thumbPager = {
        view: "pager",
        id: "thumbPager",
        template: "<center>{common.prev()}{common.page()}/#limit# images{common.next()}</center>",
        animate: false,
        size: 1,
        group: 1,
        on: {
            onItemClick: function(id, event, node) {
                //http://webix.com/snippet/e00b0728
                // delay is necessary for getting the needed page
                webix.delay(function() {
                    var page = $$("imageDataViewList").getPage();
                    var id = $$("imageDataViewList").getIdByIndex(page);
                    imageName = $$("imageDataViewList").getItem(id).name.replace(".jpg", "");
                    selectImage(imageName);
                })
            },
            onAfterPageChange: function() {
                webix.delay(function() {
                    var f = document.getElementsByClassName('webix_view webix_pager')[0].innerText;
                    var match = /\d+/.exec(f); //console.log(match);
                    document.getElementsByClassName('webix_strong')[0].innerHTML = 'Image ' + match[0];
                }, delay = 1)
            },

        }
    };

    var featureAccordion = {
        view: "form",
        id: "feature_list",
        height: "auto",
        scroll: "y",
        margin: -2,
        paddingX: 6,
        elements: []
    };

    var studyNav = {
        id: "study_view_tab",
        width: 300,
        rows: [studyList, thumbPager, imageListDataView, featureAccordion] //filter removed
    };

    /*
    initImageSlider: initialize the image thumbnail panel when a new study is selected
     */
    function initImageSlider() {
        featureButtons = [];
        var studyId = $.grep(studyListData, function(n, i) {
            return n['name'] == studyName
        })[0]['_id']; //raterData[studyName]["FeatureSetId"];
        //console.log(studyId);
        var cols = [];
        var requests = [];
        var thumbnails = [];
        var studyMetadata = get_study_metadata(studyId, token);
        //console.log(studyMetadata);
        featureSetId = studyMetadata["featureset"]["_id"];
        var featureSetData = get_featureSet_data(featureSetId, token); //raterData[studyName]["fullFeatureSet"];   //DG Edits
        //console.log(featureSetData);
        $$("imageDataViewList").clearAll();
        $$("thumbPager").select(0);

        //console.log('x', studyId);
        annotation_data = get_image_list(studyId, token);
        //console.log('ad', annotation_data);
        image_ids = annotation_data.select('imageId').toArray();//get_image_ids(annotation_data);
        image_names = annotation_data.select('name').toArray();

        image_ids = flatten_it(image_ids);
        image_names = flatten_it(image_names);

        
        //console.log(annotation_data);
        image_names = unique(image_names);
        image_ids = unique(image_ids);
        //console.log('image_names', image_names);
        //get the item associated with each of the images in that study
        //to do that we need to search girder by the image name
        //this requires doing multiple AJAX calls that are pushed into an array (requests)
        //and the response is pushed into an array (thumbnails)

        //need to re-create MarkupData

        for (i = 0; i < image_ids.length; i++) {
            var numRaters = annotation_data.filter(row => row.get('imageId') == image_ids[i]).unique('userId').toArray().length;
            thumbnails.push({
                "_id": image_ids[i],
                "name": image_names[i],
                "numRaters": numRaters
            });
        }
        /*
        	$.each(Object.keys(raterData[studyName]["MarkupData"]), function(index, image){
        	    //console.log(index, image);
                    var numRaters = Object.keys(raterData[studyName]["MarkupData"][image]["raters"]).length;

                    thumbnails.push({
                        "_id": raterData[studyName]["MarkupData"][image]["largeImageId"],
                        "name": image,
                        "numRaters": numRaters
                    });
                });
        */
        $$("imageDataViewList").parse(thumbnails);
        imageName = thumbnails[0]["name"];

        $$('feature_list').reconstruct();
        if (featureSetData.length == 0) {
            webix.message("Blank Feature Set");
        }


        //get the list of features for this study using the feature set ID
        if (featureSetData.localFeatures.length == 0)
            $$("feature_list").addView({
                view: "label",
                label: "This study has no features!"
            });

        //for each feature create a button and bind it to the feature_list view (form)
        $.each(featureSetData.localFeatures, function(index, feature) {
            btn = {
                id: feature.id,
                view: "button",
                width: 110,
                badge: 0,
                label: feature.id.replace(new RegExp("[_|/]", 'g'), " "),
                width: 90,
                height: 50,
                type: "iconTop",
                css: "feature_button",
                disabled: true
            };

            featureButtons.push(btn);
            cols.push(btn);

            //we want to create 3 columns (a row with 3 buttons)
            if ((index + 1) % 3 == 0 || index == featureSetData.localFeatures.length - 1) {
                $$("feature_list").addView({
                    cols: cols
                });
                cols = [];
            }
        });

        selectImage(imageName, annotation_data);
    }

    function selectImage(image, annotation_data) {
        computeStats(annotation_data);

        var raters = annotation_data.filter(row => row.get('name') == image).unique('userId').toArray(); //Object.keys(raterData[studyName]["MarkupData"][image]["raters"]);
        //console.log('raters var', raters);

        imageId = annotation_data.filter(row => row.get('name') == image).unique('imageId').toArray()[0][0];
        //console.log(imageId);

        var url = config.BASE_URL + "/resource/search?mode=prefix&types=%5B%22item%22%5D&q=" + image + ".jpg";
        //var url = "https://isic-archive.com/api/v1/image/"+imageId+"/download?contentDisposition=inline"
        console.log(url);
        //load the slide
        $.get(url).then(function(resource) {
            $.get(config.BASE_URL + "/folder/" + resource.item[0].folderId, function(folder) {
                slide.init(folder, resource.item[0]);
            })
        });

        annotation_list_for_current_image = get_annotation_list_for_study_image(studyId, currentImageId, token);
        //console.log('alfci', annotation_id_list);

        features = get_feature_array(annotation_list_for_current_image)

        //for each feature button return the list of raters who marked that image with the given feature
        //this will return array of objects
        featureButtons.map(function(btn) {
            //console.log("selectImage()", image, btn)
            var featureRaters = raters.filter(
                function(raterName) {
                    var annotations = features[raters.indexOf(raterName)]["annotations"];
                    if (annotations.hasOwnProperty(btn.id) && annotations[btn.id].reduce((x, y) => x + y) > 0)
                        return true;
                }).map(
                function(rater, index) {
                    //console.log('annotations', raterData[studyName]["MarkupData"][image]["raters"][rater]["meta"]["annotations"]);
                    return {
                        id: rater,
                        tiles: annotations,
                        fill: d3.schemeCategory20[index % 20]
                    }
                });

            //update the badge with the the number of raters
            $$(btn.id).config.badge = featureRaters.length;
            $$(btn.id).define("css", "feature_button");
            $$(btn.id).disable();
            $$(btn.id).detachEvent("onItemClick");

            //update the onlick event handler for the button
            if (featureRaters.length > 0) {
                $$(btn.id).enable();
                $$(btn.id).attachEvent("onItemClick", function(id) {
                    tiles.removeOverlay();
                    tiles.addRaterOverlays(id, featureRaters, slide.tiles);

                    raterslist = featureRaters.map(function(value) {
                        return value.id;
                    });

                    for (i = 0; i < featureRaters.length; i++) {
                        x = raterslist.indexOf(featureRaters[i].id);
                        if (x > -1) {
                            featureRaters[i].id = 'Rater ' + (x + 1);
                        }
                    }

                    var tmp = featureRaters.slice(0, featureRaters.length);

                    if (raterslist.length > 1) {
                        tmp.push({
                            id: "2 Rater Agreement",
                            fill: "yellow",
                            tiles: {}
                        });
                    }
                    if (raterslist.length > 2) {
                        tmp.push({
                            id: "3 Rater Agreement",
                            fill: "orange",
                            tiles: {}
                        });
                    }
                    if (raterslist.length > 3) {
                        tmp.push({
                            id: "4+ Rater Agreement",
                            fill: "red",
                            tiles: {}
                        });
                    }
                    $$("raters_list").clearAll();
                    $$("raters_list").parse(tmp);
                    // console.log(id);
                    computeStats(id);
                });
            }

            //finally, refresh the button view
            $$(btn.id).refresh();
        });
    }

    function raterAgreement(feature, raters, feature_arr) {
        //console.log("AGREEMENT DATA", studyName, imageName, feature)
        var pixels = [];


        $.each(raters, function(rater, meta) {
            var annotations = feature_arr[raters.indexOf(raterName)]["annotations"];

            if (annotations[feature] != undefined && Array.isArray(annotations[feature])) {
                pixels.push(annotations[feature]);
            }
        });

        if (pixels.length > 1) {
            var annotatedPixels = pixels.reduce(function(a, b) {
                return a.map(function(v, i) {
                    return v + b[i];
                });
            })

            var allMarked = annotatedPixels.filter(function(x) {
                return x > 0;
            });

            var agreed2 = annotatedPixels.filter(function(x) {
                return x > 1;
            });

            var agreed3 = annotatedPixels.filter(function(x) {
                return x > 2;
            });

            var agreed4 = annotatedPixels.filter(function(x) {
                return x > 3;
            });

            return {
                percentage2: Math.round(agreed2.length / allMarked.length * 100) + "%",
                percentage3: Math.round(agreed3.length / allMarked.length * 100) + "%",
                percentage4: Math.round(agreed4.length / allMarked.length * 100) + "%"
            }
        } else {
            return {
                percentage2: "100%",
                percentage3: "100%",
                percentage4: "100%"
            }
        }
    }

    function filterSlides(keyword = null) {
        url = config.BASE_URL + "/resource/search?q=" + keyword + "&mode=prefix&types=%5B%22item%22%5D";

        webix.ajax(url, function(data) {
            data = JSON.parse(data);
            var thumbs = $$("imageDataViewList");
            thumbs.clearAll();
            thumbs.parse(data["item"]);
        });
    }

    function computeStats(annotation_data, feature = null) {

        raters = annotation_data.filter(row => row.get('name') == imageName).unique('userId').toArray();
        //console.log('raters', raters);

        if (studyName == '' || imageName == '')
            return;
        currentImageId = annotation_data.filter(row => row.get('name') == imageName).unique('imageId').toArray()[0][0];
        //console.log(currentImageId);
        studyId = annotation_data.filter(row => row.get('name') == imageName).unique('studyId').toArray()[0][0];
        $$("stats_view_tab").clearAll();
        //raters = Object.keys(raterData[studyName]["MarkupData"][imageName]["raters"]);
        features = [];
        pixels = [];

        annotation_list_for_current_image = get_annotation_list_for_study_image(studyId, currentImageId, token);
        //console.log('alfci', annotation_id_list);

        features = get_feature_array(annotation_list_for_current_image)

        console.log('features_Array', features);

        raters.map(function(raterName) {

            annotations = features[raters.indexOf(raterName)]["annotations"];
            console.log(annotations);
            $.each(annotations, function(featureName, raterPixels) {
                if (Array.isArray(raterPixels))
                    pixels.push(raterPixels);
            });
        });
        console.log(pixels);
        if (pixels.length) {
            var annotatedPixels = pixels.reduce(function(a, b) {
                return a.map(function(v, i) {
                    return v + b[i];
                });
            }).filter(function(x) {
                return x;
            });

            stats = [{
                key: "Total Raters",
                value: raters.length
            }, {
                key: "Total Features",
                value: $.unique(features).length
            }, {
                key: "Markup Coverage",
                value: Math.round(annotatedPixels.length / pixels[0].length * 100) + "%"
            }];

            nraters = $$("raters_list").serialize()
            nraters = nraters.map(function(value) {
                return value.id;
            });
            nraters = nraters.filter(/./.test.bind(new RegExp('Rater [00-99]')));
            nraters = nraters.length;

            if (feature != null) {
                agreement = raterAgreement(feature, raters, features);
                //console.log(agreement);
                if (nraters > 1) {
                    stats.push({
                        key: "2 Rater Agreement",
                        value: agreement.percentage2
                    });
                }
                if (nraters > 2) {
                    stats.push({
                        key: "3 Rater Agreement",
                        value: agreement.percentage3
                    });
                }
                if (nraters > 3) {
                    stats.push({
                        key: "4+ Rater Agreement",
                        value: agreement.percentage4
                    });
                }
            }

            $$("stats_view_tab").parse(stats);
        }
    }

    return {
        view: studyNav
    }
});