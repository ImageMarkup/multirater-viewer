define("ui/header", function() {

    var menu = {
        view: "menu",
        data: [{
            id: "1",
            value: "Home",
            href: "https://isic-archive.com/#",
            target: "_blank"
        }, ],
        type: {
            height: 55
        },
        css: "menu",
        width: 90
    };

    var view = {
        borderless: true,
        cols: [{
            view: "toolbar",
            height: 80,
            css: "toolbar",
            cols: [{
                    view: "template",
                    borderless: true,
                    template: "<div id='header_title'>ISIC Archive Annotation Viewer</div><div id='header_subtitle'>International Skin Imaging Collaboration: Melanoma Project</div>",
                }, {},
                menu
            ]
        }]
    };

    return {
        view: view
    }
});
