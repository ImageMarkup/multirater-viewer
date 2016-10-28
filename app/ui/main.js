define("ui/main", ["ui/filters", "ui/header", "ui/slidenav", "ui/toolbar", "ui/metadata", "webix"], function(filters, header, slidenav, toolbar, metadata) {

    function init() {
        filters.init();

        viewerPanel = {
            rows: [toolbar.buttons, toolbar.spxTools, {
                view: "template",
                content: "image_viewer"
            }]
        };

        webix.ui(metadata.view);

        webix.ui({
            container: "main_layout",
            rows: [
                header.view, {
                    cols: [
                        slidenav.view,
                        viewerPanel
                    ]
                }
            ]
        });
    }

    return {
        init: init
    }
});