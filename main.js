require = {
    urlArgs: "bust" + (+new Date),

    paths: {
        "pubsub": "bower_components/PubSubJS/src/pubsub",
        "osd": "bower_components/openseadragon/built-openseadragon/openseadragon/openseadragon.min",
        "webix": "bower_components/webix/codebase/webix",
        "jquery": "bower_components/jquery/dist/jquery.min",
        "scalebar": "lib/openseadragon-scalebar",
        "config": "app/config",
        "slide": "app/slide",
        "zoomer": "app/zoomer",
        "osdSVG": "bower_components/svg-overlay/openseadragon-svg-overlay",
        "d3": "bower_components/d3/d3.min",
        "tiles": "app/tiles",
        "raterData": "app/raterData.min"
    },

    packages: [{
        name: "ui",
        location: "app/ui"
    }],

    shim: {
        "scalebar": ["osd"],
        "osdSVG": ["osd"]
    }
}