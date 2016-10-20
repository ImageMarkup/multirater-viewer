define("zoomer", ["pubsub", "osd", "scalebar"], function(pubsub, osd, scalebar){

	var slide = null;
    pubsub.subscribe("SLIDE", function(msg, data) {
        slide = data;
        console.log("ZOOMER SLIDE:", slide);
    });

	var viewer = osd({
		id: 'image_viewer',
		prefixUrl: "bower_components/openseadragon/built-openseadragon/openseadragon/images/",
		navigatorPosition: "BOTTOM_RIGHT",
		showNavigator: true,
		tileSources: "http://node15.cci.emory.edu/cgi-bin/iipsrv.fcgi?DeepZoom=/var/www/CDSA/CDSA_Logo_v1.tif.dzi.tif.dzi"
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

	//set viewer zoom level if the slide has this property
	viewer.addHandler("open", function() {
    		/*console.log(zoom);
			if(typeof zoom != "undefined"){    
                    zoomer.viewer.viewport.zoomBy(zoom);
                }
                if(typeof pan != "undefined"){     
                    console.log("PAN TO:", pan); 
                    zoomer.viewer.viewport.panTo(pan);
                }*/
	});

	viewer.addHandler('zoom', function(event) {
                /*tmpUrl = sharedUrl + "/" + zoomer.viewer.viewport.getZoom();
                currentZoom = zoomer.viewer.viewport.getZoom();
                currentCenter = zoomer.viewer.viewport.getCenter()
                tmpUrl += "/" + currentCenter.x + "/" + currentCenter.y;
                $$("link_to_share").setValue(tmpUrl);*/
	});

	viewer.addHandler('pan', function(event) {
                /*currentCenter = zoomer.viewer.viewport.getCenter()
                currentZoom = zoomer.viewer.viewport.getZoom();
                tmpUrl = sharedUrl + "/" + currentZoom + "/" + currentCenter.x + "/" + currentCenter.y;
                $$("link_to_share").setValue(tmpUrl);*/
	});

	return viewer;
});