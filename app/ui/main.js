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
                    },
                    {
                        view: "template",
                        template: "hello",
                        height: 70
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
                        { value: 'slide View', id: 'slide_view_tab' },
                        { value: 'study View', id: 'study_view_tab' }
                    ]
                }, {
                    cells: [
                        slidenav.view,
                        studynav.view
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