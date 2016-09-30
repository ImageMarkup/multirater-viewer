require = {
	urlArgs: "bust" + (+new Date),

	paths:{
		"osd": "bower_components/openseadragon/built-openseadragon/openseadragon/openseadragon",
		"webix": "bower_components/webix/codebase/webix",
		"jquery": "bower_components/jquery/dist/jquery",
		"scalebar": "lib/openseadragon-scalebar",
		"config": "app/config",
		"zoomer": "app/zoomer"
	},

	packages:[
		{
			name: "ui",
			location: "app/ui"
		}
	],

	shim: {
		"scalebar": ["osd"]
	}
}