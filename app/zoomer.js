define("zoomer", ["osd", "scalebar"], function(osd, scalebar){

	var viewer = osd({
		id: 'image_viewer',
		prefixUrl: "bower_components/openseadragon/built-openseadragon/openseadragon/images/",
		navigatorPosition: "BOTTOM_RIGHT",
		showNavigator: true,
		//tileSources: "http://node15.cci.emory.edu/cgi-bin/iipsrv.fcgi?DeepZoom=/PYRAMIDS/PYRAMIDS/CDSA/GBM_Frozen/intgen.org_GBM.tissue_images.3.0.0/TCGA-06-0137-01A-01-BS1.svs.dzi.tif.dzi"
	});

	viewer.scalebar({
		type: osd.ScalebarType.MAP,
		pixelsPerMeter: 1000,
		minWidth: "75px",
		location: osd.ScalebarLocation.BOTTOM_LEFT,
		xOffset: 5,
		yOffset: 10,
		stayInsideImage: true,
		color: "rgb(150, 150, 150)",
		fontColor: "rgb(100, 100, 100)",
		backgroundColor: "rgba(255, 255, 255, 0.5)",
		fontSize: "small",
		barThickness: 2
	});

	return{
		viewer: viewer
	}
});