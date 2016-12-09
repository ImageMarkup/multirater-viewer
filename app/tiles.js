define("tiles", ["pubsub", "jquery", "zoomer", "d3"], function(pubsub, $, viewer, d3) {

    function transformCoords(tiles, imageWidth) {
        coordinates = new Array(tiles.length);
        scaleFactor = 1 / imageWidth;
        $.each(tiles, function(index, tile) {
            var tileCoords = new Array;
            $.each(tile.geometry.coordinates, function(junk, coords) {
                x = coords[0] * scaleFactor;
                y = coords[1] * scaleFactor;
                tileCoords.push(x + "," + y);
            });
            
            index = parseInt(tile.properties.labelindex);
            index = index > tiles.length ? 0 : index;
            
            coordinates[index] = {
                index: index,
                coords: tileCoords.join(" ")
            };
        }); 

        return coordinates;
    }

    function addOverlay(tiles) {
        $.each(tiles, function(index, tile) {
            fillColor = d3.schemeCategory20[tile.index % 20];
            d3.select(viewer.svgOverlay().node()).append("polygon")
                .attr("points", tile.coords)
                .style('fill', "blue")
                .attr('opacity', 0.2)
                .attr('class', 'boundaryClass')
                .attr('id', 'boundaryLI' + tile.index)
                .attr('stroke', 'blue')
                .attr('stroke-width', 0.001);
        });
    }

    function addRaterOverlays(feature, raters, tiles) {
        x = new Array();
        ratersPerTile = new Array(tiles.length).fill(0);

        $.each(raters, function(junk, rater) {
            if (feature in rater.tiles) {
                x.push(rater.tiles[feature]);

                $.each(tiles, function(i, tile) {
                    if (rater.tiles[feature][i] > 0) {
                        ratersPerTile[i] += 1;
                        tile.fill = rater.fill;
                    }
                });
            }
        });

        if (x.length) {
            $.each(tiles, function(index, tile) {
                var css = ratersPerTile[index] > 1 ? "multi_rater_boundary" : "boundaryClass";
                var fill = ratersPerTile[index] > 1 ? "red" : tile.fill;
                var visibility = ratersPerTile[index] > 0 ? "visible" : "hidden";
                var opacity = ratersPerTile[index] > 1 ? 0.5 : 0.5;

                d3.select(viewer.svgOverlay().node()).append("polygon")
                    .attr("points", tile.coords)
                    .style('fill', fill)
                    .attr('opacity', opacity)
                    .attr('visibility', visibility)
                    .attr('class', css)
                    .attr('id', 'boundary' + index)
                    .attr('stroke', 'blue')
                    .attr('stroke-width', 0.001);
            });
        }
    }

    function removeOverlay() {
        $(".boundaryClass").remove();
        $(".multi_rater_boundary").remove();
    }

    function updateOverlay(className, attributes, styles) {
        $.each(attributes, function(attribute, value) {
            $("." + className).attr(attribute, value);
        });

        $.each(styles, function(style, value) {
            $("." + className).css(style, value);
        });
    }

    return {
        transformCoords: transformCoords,
        addOverlay: addOverlay,
        removeOverlay: removeOverlay,
        updateOverlay: updateOverlay,
        addRaterOverlays: addRaterOverlays
    }
});