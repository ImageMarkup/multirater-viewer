import d3 from "d3";
import $ from "jquery";
import state from "../../../models/state";
import * as tileInfo from "./tileHelperFunctions";

//var dataglobal = {};


export function handleMouseOver(d, i) {
    // self.deselectCell(d3.select(overlay.node()).selectAll('.boundaryClass'));
    // self.selectCell(d3.select(overlay.node()).select('#' + this.id));
    // console.log(d, i);
    // console.log(this.id);
    $$("curPixelInfo").parse({ curPixelId: this.id });
}

export function createFeatureButtons(featureSetData) {
    //Given a list of feature names, create individual buttons and add them to the featureListButtons element
    $$("curImgFeatureList").clear();
    $$("curImgFeatureList").reconstruct();
    var cols = [];

    //  console.log(featureSetData);
    //for each feature create a button and bind it to the curImgFeatureList view (form)
    $.each(featureSetData, function (index, feature) {
        //console.log(index, feature);
        var btn = {
            id: feature.featureName,
            view: "button",
            width: 110,
            badge: Object.keys(feature.markupDataForFeature).length,
            label: feature.featureName.replace(new RegExp("[_|/]", "g"), " "),
            width: 90,
            height: 50,
            type: "iconTop",
            css: "feature_button",
            on: {
                onItemClick: function (id) {
                    //perhaps a cleaner way to do this.. but this resets the # of spx marked for the current feature
                    $(".boundaryClass").css("opacity", 0);
                    $(".raterClass").remove(); //remove all the previously marked up rater
                    // Set the boundary class opacity to 0... should also update the SpxMaskOpacity.
                    //Sergey--- what's the cleanest way to bind the spxMask Opacity to this function
                    //so I only needto update this in one spot
                    /* To discuss with Konstantinos...*/

                    /* Grab the most recent raterData Information so I can use the right color scheme */
                    var raterDataDict = {};
                    $$("raterInfoDataTable")
                        .serialize()
                        .forEach((rtrData) => {
                            raterDataDict[rtrData.raterName] = rtrData;
                        });

                    /* First blank out all the data for all raters... */
                    Object.keys(raterDataDict).forEach(rtr => {
                        $$("raterInfoDataTable").updateItem(raterDataDict[rtr].id, {
                            spxMarkedForCurrentFeature: "",
                            raterTotalFeaturesSeen: "",
                            spxMarkedForCurrentFeatureCount: ""
                        });
                    })

                    

                    //While adding the raters, create the compsite version as well
                    var spxMarkupCountDict = new Object();
                    var rtr = {};
                    for (rtr in state.curImageMetaData.markupData[id]) {
                        $.each(state.curImageMetaData.markupData[id][rtr], function (idx, spx) {

                            

                            (!spxMarkupCountDict.hasOwnProperty(parseInt(spx))) ? (spxMarkupCountDict[parseInt(spx)] = 1) : (spxMarkupCountDict[parseInt(spx)]++);
                        });

                        console.log(state.curImageMetaData.markupData);

                        //Crap have to first blanken EVERY column for all raters, then fill in the gaps..
                        //    update the data table to show the count for the currently displayed feature
                        $$("raterInfoDataTable").updateItem(raterDataDict[rtr].id, {
                            spxMarkedForCurrentFeatureCount: state.curImageMetaData.markupData[id][rtr].length,
                            spxMarkedForCurrentFeature: state.curImageMetaData.markupData[id][rtr],
                            raterTotalFeaturesSeen: ""
                        });

                        //this adds the overlay for a single rater
                        //This will all be run from the data table...
                        // tileInfo.addRaterOverlay(
                        //     state.curImgTileData,
                        //     state.curImageMetaData.markupData[id][rtr],
                        //     raterDataDict[rtr]["raterColor"],
                        //     raterDataDict[rtr]["raterClassName"]
                        // );

                    }

                    $$("raterInfoDataTable").updateItem(raterDataDict[rtr].id, {
                        raterTotalFeaturesSeen: state.curImageMetaData.markupData[id][rtr].length,
                    });

                    // /  console.log(raterDataDict);

                    tileInfo.generateRaterAgreements(state.curImgTileData, spxMarkupCountDict);


                    //now that I have added all of the layers, let's quickly make sure everything is toggled on / off appropriately
                    $.each(raterDataDict, function (rtrName, raterData) {

                        var mrOpacity = $$("multirater_opacity_slider").getValue(); //Get the opacity from thne multiraterOpacity..
                        var raterOpacity = raterData.showRaterMarkupCheckbox == "on" ? mrOpacity : 0;
                        $("." + raterData.raterClassName).css("opacity", raterOpacity);
                    });
                },
            },
        };

        cols.push(btn);
        //                we want to create 3 columns (a row with 3 buttons)
        if ((index + 1) % 4 == 0 || index == featureSetData.length - 1) {
            $$("curImgFeatureList").addView({ cols: cols });
            cols = [];
        }
    });
}
