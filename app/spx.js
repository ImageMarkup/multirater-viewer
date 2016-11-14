define("spx", ["pubsub", "jquery", "zoomer", "d3"], function(pubsub, $, viewer, d3) {



            LICoords = {};

            POIList = {};

            function transform(regions, imageWidth) {
                coordinates = new Array();
                scaleFactor = 1 / imageWidth;
                $.each(regions, function(index, region) {
                        var regionCoords = new Array;
                        $.each(region.geometry.coordinates, function(junk, coords) {
                            x = coords[0] * scaleFactor;
                            y = coords[1] * scaleFactor;
                            regionCoords.push(x + "," + y);
                            //we also need to grab region.properties.labelindex  need to refavor though since this is an ARRAY!!! 
                        });
                     //   console.log(region.properties.labelindex);
                        coordinates.push({
//                            index: region.properties.labelindex,
                            labelIndex: region.properties.labelindex,
                            coords: regionCoords.join(" "),
                            fill: "blue",
                            opacity: 0.2
                        });
                        LICoords[region.properties.labelindex] = regionCoords.join(" ");
                    })
                    return coordinates;


                        LabelIndexToSPXCoords = LICoords;



                }

                function addOverlay(regions) {
                    $.each(regions, function(index, region) {
                        fillColor = d3.schemeCategory20[index % 20];
                        console.log(regions);
                        d3.select(viewer.svgOverlay().node()).append("polygon")
                            .attr("points", region.coords)
                            .style('fill', fillColor)
                            .attr('opacity', 0.2)
                            .attr('class', 'boundaryClass')
                            .attr('id', 'boundaryLI' + region.labelIndex)
                            .attr('stroke', 'blue')
                            .attr('stroke-width', 0.001);
                        LICoords[region.labelIndex] = region.coords;
                    });
                


                }

                function addRaterOverlays(feature, raters, regions) {
                    console.log(feature,'is current feature');

                    console.log(raters,"raters");
                    console.log(regions,"regions");


                    foi = "pigment_network/typical";



                    markedUpPoints = []
                    $.each(raters, function(junk,rater)
                        {
                            if (foi in rater.spx)
                                {
                                    console.log(rater.spx[foi]);
                                    $.each(rater.spx[foi], function(j,k)
                                            {
                                            if (k>0){markedUpPoints.push(j)}
                                            })
                                }
                        });
                    console.log(markedUpPoints);
                    POIList = markedUpPoints;


                    $.each(POIList, function( a,b) {

                            d3.select(viewer.svgOverlay().node()).append("polygon")
                                .attr("points", LICoords[b])
                                .style('fill', 'yellow')
                                .attr('opacity', 1.0)
                                .attr('visibility', 'visible')
                                .attr('class', 'dgHack')
                                .attr('id', 'boundary' + b)
                                .attr('stroke', 'yellow')
                                .attr('stroke-width', 0.001);



                    })



                    x = new Array();
                    ratersPerRegion = new Array(regions.length).fill(0);
                    var index = 0;
                    // console.log(ratersPerRegion);
                    $.each(raters, function(junk, rater) {
                        if (feature in rater.spx) {
                            x.push(rater.spx[feature]);

                            $.each(regions, function(i, region) {
                                region.fill = rater.fill;

                                if (rater.spx[feature][i] > 0) {
                                    ratersPerRegion[i] += 1;
                                }
                            });
                        }

                        index++;
                    });

                    if (x.length) {
                        $.each(regions, function(index, region) {
                            var css = ratersPerRegion[index] > 1 ? "multi_rater_boundary" : "boundaryClass";
                            var visibility = ratersPerRegion[index] > 0 ? "visible" : "hidden";
                            var opacity = ratersPerRegion[index] > 1 ? 0.5 : 0.5;

                            d3.select(viewer.svgOverlay().node()).append("polygon")
                                .attr("points", region.coords)
                                .style('fill', region.fill)
                                .attr('opacity', opacity)
                                .attr('visibility', visibility)
                                .attr('class', css)
                                .attr('id', 'boundary' + region.labelIndex)
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
