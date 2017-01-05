define("ui/main", ["ui/filters", "ui/header", "ui/slidenav", "ui/studynav", "ui/toolbar", "ui/metadata", "ui/spxnav", "webix"],
    function(filters, header, slidenav, studynav, toolbar, metadata, spxnav) {

        function init() {

            filters.init();

            viewerPanel = {
                rows: [
                    toolbar.buttons, 
                    {
                        view: "template",
                        content: "image_viewer"
                    }
                ]
            };

            webix.ui(metadata.view);

            var navTabbar = {
                rows: [{
                    view: "tabbar",
                    id: 'navTabbar',
                    value: 'formView',
                    multiview: true,
                    options: [
                        { value: 'Study View', id: 'study_view_tab' },
                        { value: 'Slide View', id: 'slide_view_tab' },
                        { value: 'Stats', id: 'stats_view_tab' },
                    ]
                }, {
                    cells: [
                        studynav.view,
                        slidenav.view,
                        
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
                            spxnav.view
                        ]
                    }
                ]
            });
        }

        return {
            init: init
        }
    });