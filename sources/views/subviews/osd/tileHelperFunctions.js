const $ = require("jquery");
const d3 = require("d3");

//Green  Green 
const heatMapColors = ["#ffff00", "#ff700e", "#ff0000", "#ff6700", "#ff0000", "#f000ff"];

export function transformCoords(tiles, imageWidth) {
    coordinates = new Array(tiles.length);
    scaleFactor = 1 / imageWidth;
    $.each(tiles, function (index, tile) {
        var tileCoords = new Array();
        $.each(tile.geometry.coordinates, function (junk, coords) {
            x = coords[0] * scaleFactor;
            y = coords[1] * scaleFactor;
            tileCoords.push(x + "," + y);
        });

        index = parseInt(tile.properties.labelindex);
        index = index > tiles.length ? 0 : index;

        coordinates[index] = {
            index: index,
            coords: tileCoords.join(" "),
        };
    });

    return coordinates;
}

export function addOverlay(tiles) {
    $.each(tiles, function (index, tile) {
        var fillColor = d3.schemeCategory10[tile.index % 20];
        d3.select(viewer.svgOverlay().node())
            .append("polygon")
            .attr("points", tile.coords)
            .style("fill", "blue")
            .attr("opacity", 0.0)
            .attr("class", "boundaryClass")
            .attr("id", "boundaryLI" + tile.index)
            .attr("stroke", "blue")
            .attr("stroke-width", 0.001);
    });
}

export function generateRaterAgreements(tiles, allRaterData) {
    /* This will take the data for all the raters and generate an overlay... need to figure out if I can generate one shape
    and then filter that.. instead of drawing 5 shapes*/
    console.log(allRaterData)

    /* The max number of raters is 5--- probably should compute this though instead of just hard coding it  */
    var spxMarkupCountDict = allRaterData;
    var spxMarkupMap = {};

    $.each(spxMarkupCountDict, function (spxId, raterCount) {
        (!spxMarkupMap.hasOwnProperty(raterCount)) ? (spxMarkupMap[raterCount] = [spxId]) : (spxMarkupMap[raterCount].push(spxId));
    })


    //Goign to push all this data to a table instead.. and just render/update from the table.. this is too confusing as it was written
    for (var i = 1; i <= 3; i++) {
        var mrc = 'moreThan' + i; //#multiRaterClassName
        var mrcId = $$("raterInfoDataTable").find(function (obj) { return obj.raterClassName == mrc }, true);

        if (spxMarkupMap[i]) {
            $$("raterInfoDataTable").updateItem(mrcId.id, {
                spxMarkedForCurrentFeature: spxMarkupMap[i],
                raterTotalFeaturesSeen: "",
                spxMarkedForCurrentFeatureCount: spxMarkupMap[i].length
            });
        }
    }

    /* This will take the data for all the raters and generate an overlay... need to figure out if I can generate one shape
    and then filter that.. instead of drawing 5 shapes*/
    console.log(allRaterData)
    /* The max number of raters is 5--- probably should compute this though instead of just hard coding it  */
    var spxMarkupCountDict = allRaterData;
    var spxMarkupMap = {};

    $.each(spxMarkupCountDict, function (spxId, raterCount) {
        (!spxMarkupMap.hasOwnProperty(raterCount)) ? (spxMarkupMap[raterCount] = [spxId]) : (spxMarkupMap[raterCount].push(spxId));
    })

    /* I now have a diciontary where the keys are the number of people who observed the feature at the coordinate, and the value are the coordinates */
    // $.each(spxMarkupMap, function(raterCount, spxList) {
    //     //GUTMAN EDIT 7/30/2022..

    //     if (raterCount < 4) {

    //         addRaterOverlay(
    //             tiles,
    //             spxList,
    //             heatMapColors[raterCount],
    //             "multiRater raterClass" + " moreThan" + raterCount
    //         );
    //     }
    //     //Probably want to add it twice.. one without the fill.. one with???
    // })

    //  console.log(allRaterData)
    renderSpxImages(tiles, "raterInfoDataTable")


}


function renderSpxImages(tiles, tableName) {
    /*Passing the table name.. not a reference... */
    console.log(tiles);
    console.log(tableName)
    $(".raterClass").remove();

    var dt = $$("raterInfoDataTable")

    dt.data.each(r => {

        if (r.spxMarkedForCurrentFeature) {
            //      console.log(r)
            addRaterOverlay(
                tiles,
                r.spxMarkedForCurrentFeature,
                r.raterColor,
                r.raterClassName + " multiRater raterClass"
            );
        }


    })
    /* Let's clear everything and just render the current table... */



}


export function addRaterOverlay(tiles, spxIdsToLabel, raterColor, className) {
    var fillColor = raterColor;
    var spxIntIds = spxIdsToLabel.map(Number);

    // console.log(tiles,spxIdsToLabel,raterColor,className)
    var overlay = $$("slide_viewer").viewer.svgOverlay();
    var mrOpacity = $$("multirater_opacity_slider").getValue();

    $.each(tiles, function (index, tile) {
        if (spxIntIds.includes(parseInt(tile.properties.labelindex))) {
            d3.select(overlay.node())
                .append("polygon")
                .attr("points", tile.geometry.coordinates)
                .style("fill", fillColor) //was fillColor
                .attr("opacity", mrOpacity)
                .attr("fill-opacity", mrOpacity) //was over/2
                .attr("class", "raterClass" + " " + className) //add multiple classes in a single call
                .attr("id", "raterLI" + tile.properties.labelindex)
                .attr("stroke", fillColor)
                .attr("stroke-width", 1);
        }
    });
}

function removeOverlay() {
    $(".boundaryClass").remove();
    $(".multiRater").remove();
    $(".raterClass").remove();
}

export function updateOverlay(className, attributes, styles) {
    $.each(attributes, function (attribute, value) {
        $("." + className).attr(attribute, value);
    });

    $.each(styles, function (style, value) {
        $("." + className).css(style, value);
    });
}