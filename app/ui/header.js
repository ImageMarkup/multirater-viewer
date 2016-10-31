define("ui/header", function() {

    var menu = {
        view: "menu",
        data: [{
            id: "1",
            value: "Community",
            submenu: [{
                value: "Home",
                href: "https://isic-archive.com/#",
                target: "_blank"
            }, {
                value: "About",
                href: "http://isdis.net/isic-project/",
                target: "_blank"
            }, {
                value: "About",
                href: "http://isdis.net/isic-project/",
                target: "_blank"
            }, ]
        }, {
            id: "2",
            value: "Form",
            href: "http://forum.isic-archive.com/",
            target: "_blank"
        }],
        type: {
            height: 55
        },
        css: "menu",
        width: 160
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
                    template: "<div id='header_title'>ISIC Archive</div><div id='header_subtitle'>International Skin Imaging Collaboration: Melanoma Project</div>",
                }, {},
                menu
            ]
        }]
    };

    /*view = {
        view: "template",
        height: 80,
        template: "<div id='header_title'>ISIC Archive</div><div id='header_subtitle'>International Skin Imaging Collaboration: Melanoma Project</div>"
    };*/

    return {
        view: view
    }
});