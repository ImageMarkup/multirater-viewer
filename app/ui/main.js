define("ui/main", ["ui/filters", "ui/header", "ui/slidenav", "ui/toolbar", "ui/metadata", "ui/spxnav", "webix"],
    function(filters, header, slidenav, toolbar, metadata, spxnav) {

        function init() {
            filters.init();

            viewerPanel = {
                rows: [toolbar.buttons, {
                    view: "template",
                    content: "image_viewer"
                }]
            };

            webix.ui(metadata.view);

            webix.ui({
                container: "main_layout",
                id: "app",
                rows: [
                    header.view, {
                        cols: [
                            slidenav.view, {
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