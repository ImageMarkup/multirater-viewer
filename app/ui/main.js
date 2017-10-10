define("ui/main", ["ui/filters", "ui/header", "ui/slidenav", "ui/studynav", "ui/toolbar", "ui/metadata", "ui/spxnav", "ui/featurenav", "webix"],
    function(filters, header, slidenav, studynav, toolbar, metadata, spxnav, featurenav) {

        function init() {
            filters.init();

            viewerPanel = {
                id: "slide_viewer",
                header: "Slide Viewer",
                body:{
                    rows: [
                        toolbar.buttons, 
                        {
                            view: "template",
                            content: "image_viewer"
                        }
                    ]
                }
            };

            webix.ui(metadata.view);

            var navTabbar = {
                rows: [{
                    view: "tabbar",
                    id: 'navTabbar',
                    value: 'formView',
                    multiview: true,
                    options: [
                        { value: 'Study View', id: 'study_view_tab'},
                    ],
                    on:{
                        onChange: function(id){
                            if(id=="study_view_tab"){
                                $$("slide_viewer").enable();
                                $$("slide_viewer").expand();
//                                $$("feature_thumbnails").collapse();
//                                $$("feature_thumbnails").disable();
                                $$("spx_tools").enable();
                            }
                        }
                    }
                }, {
                    cells: [
                        studynav.view,
//                        slidenav.view,
//                        featurenav.view
                    ]
                }]
            };

            webix.ui({
                container: "main_layout",
                id: "app",
                rows: [
                    header.view, 
                    {
                        cols: [
                            navTabbar, {
                                view: "resizer"
                            },
                            viewerPanel, {
                                view: "resizer"
                            },
                            featurenav.accordion, {
                                view: "resizer"
                            },
                            spxnav.view,
                            { gravity:0.0001 }
                        ]
                    }
                ]
            });
        }

        return {
            init: init
        }
    });
