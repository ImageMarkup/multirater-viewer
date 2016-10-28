require = {
	urlArgs: "bust" + (+new Date),

	paths:{
		"pubsub": "bower_components/PubSubJS/src/pubsub",
		"hasher": "bower_components/hasher/dist/js/hasher.min",
        "signals": "bower_components/js-signals/dist/signals.min",
        "crossroads": "bower_components/crossroads/dist/crossroads.min",
		"osd": "bower_components/openseadragon/built-openseadragon/openseadragon/openseadragon",
		"webix": "bower_components/webix/codebase/webix",
		"jquery": "bower_components/jquery/dist/jquery",
		"scalebar": "lib/openseadragon-scalebar",
		"config": "app/config",
		"routes": "app/routes",
		"slide": "app/slide",
		"zoomer": "app/zoomer",
		"osdSVG": "bower_components/svg-overlay/openseadragon-svg-overlay",
		"d3": "bower_components/d3/d3.min",
		"osdSPX": "app/svgOverlay"
	},

	packages:[
		{
			name: "ui",
			location: "app/ui"
		}
	],

	shim: {
		"scalebar": ["osd"], 
		"osdSVG": ["osd"]
	}
}