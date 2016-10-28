define("spx", ["pubsub", "jquery", "zoomer", "d3"], function(pubsub, $, viewer, d3) {

    function transform(regions, imageWidth){
        coordinates = new Array();
        scaleFactor = 1/imageWidth;
        $.each(regions, function(index, region){
            var regionCoords = new Array;
            $.each(region.geometry.coordinates, function(junk, coords){
                x = coords[0] * scaleFactor;
                y = coords[1] * scaleFactor;
                regionCoords.push(x + "," + y);
            });

            coordinates[index]= {
                coords: regionCoords.join(" ")
            }
        });

        return coordinates;
    }

    function addOverlay(regions){
        $.each(regions, function(index, region){
            fillColor = d3.schemeCategory20[index % 20];

            d3.select(viewer.svgOverlay().node()).append("polygon")
                .attr("points", region.coords)
                .style('fill', fillColor)
                .attr('opacity', 0.2)
                .attr('class', 'boundaryClass')
                .attr('id', 'boundary'+index)
                .attr('stroke','blue')
                .attr('stroke-width', 0.001);
        });
    }

    function removeOverlay(){
        $(".boundaryClass").remove();
    }

    function updateOverlay(properties){
        $.each(properties, function(property, value){
            $(".boundaryClass").attr(property, value);
        });
    }

    return{
        transform: transform,
        addOverlay: addOverlay,
        removeOverlay: removeOverlay,
        updateOverlay: updateOverlay
    }
});