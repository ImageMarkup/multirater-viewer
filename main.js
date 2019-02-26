require = {
    urlArgs: "bust" + (+new Date),
    waitSeconds: 20,
 //   baseUrl: "/node_modules/",
    paths: {
        "pubsub": "node_modules/pubsub-js/src/pubsub",
         "osd": "node_modules/openseadragon/build/openseadragon/openseadragon.min",
         "webix": "node_modules/webix/webix",
         "jquery": "node_modules/jquery/dist/jquery.min",
        "scalebar": "lib/openseadragon-scalebar",
        "config": "app/config",
        "slide": "app/slide",
        "zoomer": "app/zoomer",
         "osdSVG": "node_modules/svg-overlay/openseadragon-svg-overlay",
        "d3": "node_modules/d3/dist/d3.min",
        "tiles": "app/tiles",
        "raterData": "app/raterData_v5",
        "featureData": "app/featureSetData"
    },

    packages: [{
        name: "ui",
        location: "./app/ui"
    }],

    shim: {
        "scalebar": ["osd"],
        "osdSVG": ["osd"]
    }
}
