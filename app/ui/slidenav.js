define("ui/slidenav", ["config", "zoomer", "slide", "jquery","raterData"], function(config, zoomer, slide, $, raterData) {

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

    return {
        view: slideNav
    }
});
