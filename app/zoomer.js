define("zoomer", ["pubsub", "osd", "scalebar","osdSVG","d3"], function(pubsub, osd, scalebar,osdSVG,d3){

	var slide = null;
    pubsub.subscribe("SLIDE", function(msg, data) {
        slide = data;
    });

	var viewer = osd({
		id: 'image_viewer',
		prefixUrl: "bower_components/openseadragon/built-openseadragon/openseadragon/images/",
		navigatorPosition: "BOTTOM_RIGHT",
		showNavigator: true
	});


    var svg_layer = viewer.svgOverlay();


    //example of adding a rectangle

	    // var d3Rect = d3.select(svg_layer.node()).append("rect")
	    //                     .style('fill', '#f00')
	    //                     .attr("x", 0.5)
	    //                     .attr("width", 0.25)
	    //                     .attr("y", 0.5)
	    //                     .attr("height", 0.25);

	viewer.scalebar({
		type: osd.ScalebarType.MAP,
		pixelsPerMeter: 100000,
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

	});

	viewer.addHandler('zoom', function(event) {

	});

	viewer.addHandler('pan', function(event) {

	});

	return viewer;
});