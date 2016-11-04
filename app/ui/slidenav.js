define("ui/slidenav", ["config", "zoomer", "slide", "jquery","raterData", "spx"], function(config, zoomer, slide, $, raterData, spx) {

    var folderName = null;
    var patientId = null;
    var studyName = null;
    var imageName = null;
    var selectedRaters = new Array();

    var setDropdown = {
        view: "combo",
        placeholder: "Select Slide Set",
        id: "slideset_list",
        options: {
            body: {
                template: "#name#",
                url: config.BASE_URL + "/folder?parentType=folder&parentId=" + config.FOLDER_ID
            }
        },
        on: {
            "onChange": function(id) {
                var item = this.getPopup().getBody().getItem(id);
                var thumbs = $$("thumbnails_panel");
                var url = config.BASE_URL + "/folder?parentType=folder&parentId=" + item._id
                thumbs.clearAll();
                thumbs.load(url);
            },
            "onAfterRender": function() {
                $.get(config.BASE_URL + "/folder?parentType=folder&parentId=" + config.FOLDER_ID, function(folders) {
                    var foldersMenu = $$("slideset_list").getPopup().getList();
                    foldersMenu.clearAll();
                    foldersMenu.parse(folders);
                    $$("slideset_list").setValue(folders[0].id);
                });
            }
        }
    };

    var thumbnailsPanel = {
        view: "dataview",
        id: "thumbnails_panel",
        select: true,
        template: "<div class='webix_strong'>#name#</div><img src='" + config.BASE_URL + "/file/#meta.thumbNailId#/download?.jpg'/>",
        datatype: "json",
        type: {
            height: 170,
            width: 200
        },
        ready: function() {
            var item = this.getItem(this.getFirstId());
            slide.init(item);
        },
        on: {
            "onItemClick": function(id, e, node) {
                item = this.getItem(id);
                slide.init(item);
            }
        }
    };

    var slideNav = {
        width: 220,
        id: "slide_view_tab",
            rows: [
                setDropdown,
                thumbnailsPanel
        ]
    };

    /* Annotation view */
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
                var image = this.getPopup().getBody().getItem(id);
                var imageName = image.id;
                var raters = Object.keys(raterData[studyName][image.id]["raters"]);
                
                $.each($$("user_study_list").elements, function(k, e){
                    $$("user_study_list").removeView(e.data.id);
                });

                $.each(raters, function(junk, rater){
                        var u = { 
                            view:"toggle", 
                            id: rater,
                            name: rater, 
                            offLabel: rater + " (ON)", 
                            onLabel: rater + " (OFF)",
                            
                            on:{
                                onItemClick: function(id, e, node){
                                    var rater = {
                                        "rater": $$(id).data.id, 
                                        "color": {"r": 245, "g": 45, "b": 90}, 
                                        "spx": raterData[studyName][imageName]["raters"][$$(id).data.id]["meta"]["annotations"]["starburst_pattern"]
                                    };

                                    selectedRaters.push(rater);
                                    console.log(selectedRaters);
                                }
                            }
                        };

                        $$("user_study_list").addView(u);
                });
            }
        }
    };
   
    var userStudyList = {
        view:"form", 
        width:200, 
        id: "user_study_list",
        scroll: false,
        elements:[]
    };

    var studyNav = { 
        id: "study_view_tab", 
        width: 220,
        rows:[studyList, imageList, userStudyList, {}]
    };

    //TO DO:
    // Add DropDown to populate Study List:
    // This then does a secondary callback and grabs StudyParticipants
    // Will need to clean/parse this...


    //Adding a Slide View and a Study/Annotation View-- First add a tabbar widget
    var navTabbar = {
        rows: [{
            view: "tabbar",
            id: 'navTabbar',
            value: 'formView',
            multiview: true,
            options: [
                { value: 'slide View', id: 'slide_view_tab' },
                { value: 'study View', id: 'study_view_tab' }
            ]
        }, {
            cells: [
                slideNav,
                studyNav
            ]
        }]
    };

    return {
        view: navTabbar
    }
});
