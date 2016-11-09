define("spx", ["pubsub", "jquery", "zoomer", "d3"], function(pubsub, $, viewer, d3) {

    function transform(regions, imageWidth) {
        coordinates = new Array();
        scaleFactor = 1 / imageWidth;
        $.each(regions, function(index, region) {
            var regionCoords = new Array;
            $.each(region.geometry.coordinates, function(junk, coords) {
                x = coords[0] * scaleFactor;
                y = coords[1] * scaleFactor;
                regionCoords.push(x + "," + y);
            });

            coordinates[index] = {
                index: index,
                coords: regionCoords.join(" "),
                fill: "blue",
                opacity: 0.2
            }
        });

        return coordinates;
    }

    function addOverlay(regions) {
        $.each(regions, function(index, region) {
            fillColor = d3.schemeCategory20[index % 20];

            d3.select(viewer.svgOverlay().node()).append("polygon")
                .attr("points", region.coords)
                .style('fill', fillColor)
                .attr('opacity', 0.2)
                .attr('class', 'boundaryClass')
                .attr('id', 'boundary' + index)
                .attr('stroke', 'blue')
                .attr('stroke-width', 0.001);
        });
    }

    function addRaterOverlays(feature, raters, regions){
        x = new Array();
        ratersPerRegion = new Array(regions.length).fill(0);
        var index = 0;
        
        $.each(raters, function(junk, rater){
            if(feature in rater.spx){
                x.push(rater.spx[feature]);

                $.each(regions, function(i,region){
                    region.fill = rater.fill;

                    if(rater.spx[feature][i] > 0){
                        ratersPerRegion[i] += 1;
                    }
                });
            }

            index++;
        });
        
        if(x.length){
            $.each(regions, function(index, region) {
                var css = ratersPerRegion[index] > 1 ? "multi_rater_boundary" : "boundaryClass";
                var visibility = ratersPerRegion[index] > 0 ? "visible" : "hidden";
                var opacity = ratersPerRegion[index] > 1 ? 0.5 : 0.2;

                d3.select(viewer.svgOverlay().node()).append("polygon")
                    .attr("points", region.coords)
                    .style('fill', region.fill)
                    .attr('opacity', opacity)
                    .attr('visibility', visibility)
                    .attr('class', css)
                    .attr('id', 'boundary' + region.index)
                    .attr('stroke', 'blue')
                    .attr('stroke-width', 0.001);
            }); 
        }
    }

    function removeOverlay() {
        $(".boundaryClass").remove();
        $(".multi_rater_boundary").remove();
    }

    function updateOverlay(className, properties) {
        $.each(properties, function(property, value) {
            $("." + className).attr(property, value);
        });
    }

    return {
        transform: transform,
        addOverlay: addOverlay,
        removeOverlay: removeOverlay,
        updateOverlay: updateOverlay,
        addRaterOverlays: addRaterOverlays
    }
});