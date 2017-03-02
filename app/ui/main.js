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
                        { value: 'Slide View', id: 'slide_view_tab' },
                        { value: 'Feature View', id: 'feature_view_tab' }
                    ],
                    on:{
                        onChange: function(id){
                            if(id=="study_view_tab"){
                                $$("slide_viewer").enable();
                                $$("slide_viewer").expand();
                                $$("feature_thumbnails").collapse();
                                $$("feature_thumbnails").disable();
                                $$("spx_tools").enable();
                            }
                            else if(id=="feature_view_tab"){
                                $$("feature_thumbnails").expand();
                                $$("feature_thumbnails").enable();
                                $$("spx_tools").collapse();
                                $$("spx_tools").disable();
                                $$("slide_viewer").collapse();
                                $$("slide_viewer").disable();
                            }
                            else if(id=="slide_view_tab"){
                                $$("spx_tools").collapse();
                                $$("spx_tools").disable();
                                $$("feature_thumbnails").collapse();
                                $$("feature_thumbnails").disable();
                                $$("slide_viewer").enable();
                                $$("slide_viewer").expand();
                            }
                               
                        }
                    }
                }, {
                    cells: [
                        studynav.view,
                        slidenav.view,
                        featurenav.view
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