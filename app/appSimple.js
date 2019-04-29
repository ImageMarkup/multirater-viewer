define(["webix", "zoomer", "tiles", "d3"], function(webix, zoomer, tiles, d3) {

    markupDataDict = {
        "ISIC_0016081": [
            { "id": "Dots : Irregular--marghooa--ISIC_0016081","spxList": [318, 333, 358, 369, 436, 475, 520, 534, 557, 560, 561, 629, 635, 639]},
            { "id": "Dots : Irregular--braunr--ISIC_0016081", "spxList": [436, 561] },
            { "id": "Dots : Irregular--susipuig--ISIC_0016081", "spxList": [388, 391, 396, 436, 439, 454, 456, 475, 561, 592, 603, 604, 642] },
            { "id": "Globules / Clods : Irregular--marghooa--ISIC_0016081", "spxList": [359, 369, 388, 436, 475, 561, 655] },
            { "id": "Lines : Pseudopods--marghooa--ISIC_0016081", "spxList": [333, 336, 342, 359] },
            { "id": "Lines : Pseudopods--braunr--ISIC_0016081", "spxList": [271, 293, 301, 308, 342, 359] },
            { "id": "Lines : Pseudopods--harald--ISIC_0016081", "spxList": [289, 301] },
            { "id": "Lines : Radial streaming--marghooa--ISIC_0016081", "spxList": [271, 276, 289, 293, 359] },
            { "id": "Lines : Radial streaming--braunr--ISIC_0016081", "spxList": [271, 276, 289, 342, 359] },
            { "id": "Network : Atypical pigment network / Reticulation--marghooa--ISIC_0016081", "spxList": [271, 276, 287, 292, 301, 308, 311, 318, 321, 343, 371, 381, 427, 597, 624, 633, 671, 673, 679, 684, 702, 729, 731] },
            { "id": "Network : Atypical pigment network / Reticulation--braunr--ISIC_0016081", "spxList": [329, 333, 342, 351, 352, 369, 388, 390, 392, 420, 422, 429, 431, 456, 488, 507, 524, 534, 546] },
            { "id": "Network : Atypical pigment network / Reticulation--susipuig--ISIC_0016081", "spxList": [271, 276, 287, 289, 292, 301, 308, 311, 316, 318, 321, 325, 329, 333, 341, 342, 343, 351, 352, 354, 358, 359, 369, 381, 388, 390, 420, 422, 427, 428, 429, 430, 445, 463, 488, 493, 502, 507, 523, 524, 534, 544, 546, 549, 557, 563, 575, 578, 589, 592, 597, 608, 624, 629, 633, 635, 636, 649, 650, 658, 664, 669, 671, 673, 679, 684, 692, 702, 729, 731] },
            { "id": "Network : Broadened pigment network / Reticulation--braunr--ISIC_0016081", "spxList": [271, 276, 287, 292, 311, 321, 325, 343, 381, 597, 624, 633, 673, 684, 702, 729] },
            { "id": "Network : Broadened pigment network / Reticulation--harald--ISIC_0016081", "spxList": [271, 276, 287, 292, 311, 321, 343, 351, 354, 381, 390, 575, 597, 624, 650, 664, 671, 673, 679, 684, 699, 702] },
            { "id": "Regression structures : Peppering / Granularity--braunr--ISIC_0016081", "spxList": [358, 603, 617, 642] },
            { "id": "Regression structures : Peppering / Granularity--susipuig--ISIC_0016081", "spxList": [358, 439, 475, 492, 495, 520, 534, 539, 561, 603, 604, 642, 643, 655, 664] },
            { "id": "Structureless : Blotch irregular--braunr--ISIC_0016081", "spxList": [329, 341, 439, 492, 508, 542, 554, 613] }
        ],
        "ISIC_0016127": [
        { "id": "Globules / Clods : Irregular--marghooa--ISIC_0016127", "spxList": [476, 504, 506, 511, 532, 539] },
        { "id": "Globules / Clods : Irregular--braunr--ISIC_0016127", "spxList": [462, 466, 469, 470, 476, 504, 506, 511, 532, 545, 557] },
        { "id": "Globules / Clods : Irregular--harald--ISIC_0016127", "spxList": [426, 447, 462, 466, 469, 470, 476, 489, 504, 506, 511, 532, 545, 552, 557] },
        { "id": "Vessels : Dotted--marghooa--ISIC_0016127", "spxList": [370, 372, 373, 399, 400, 413, 435, 438, 474, 514, 524, 535, 570, 572, 604] },
        { "id": "Vessels : Dotted--braunr--ISIC_0016127", "spxList": [370, 394, 400, 413, 418, 435, 438, 451, 473, 474, 496, 514, 524, 535, 544, 570, 572, 584, 593, 604, 610] },
        { "id": "Vessels : Dotted--harald--ISIC_0016127", "spxList": [359, 370, 394, 400, 413, 435, 438, 451, 473, 474, 496, 514, 524, 535, 570, 572, 604, 610] }
        ]
    }

    spxData = markupDataDict['ISIC_0016081']

    apply = function() { console.log("DO STUFF") }

    applyOpacity = function() {
        $(".boundaryClass").css('opacity', $$("opacity_slider").getValue())
        $(".rater1").css('opacity', $$("mOpacity_slider").getValue())
        $(".rater2").css('opacity', $$("mOpacity_slider").getValue())
    }

    applyThickness = function() {
        console.log(this);
        $(".boundaryClass").css('stroke-width', $$("stroke_slider").getValue())
    }

    var opacitySlider = {
        view: "slider",
        id: "opacity_slider",
        label: "Opacity",
        labelPosition: "top",
        value: "0.2",
        step: 0.05,
        min: 0,
        max: 1,
        width: 200,
        on: {
            "onSliderDrag": applyOpacity,
            "onChange": applyOpacity
        }
    };

    //for the multiRater 
    var mOpacitySlider = {
        view: "slider",
        id: "mOpacity_slider",
        label: "Opacity",
        labelPosition: "top",
        value: "0.2",
        step: 0.05,
        min: 0,
        max: 1,
        width: 200,
        on: {
            "onSliderDrag": applyOpacity,
            "onChange": applyOpacity
        }
    };

    var strokeSlider = {
        view: "slider",
        id: "stroke_slider",
        label: "Stroke",
        value: "0.001",
        labelPosition: "top",
        step: 0.0000001,
        min: 0,
        max: 0.005,
        width: 200,
        on: {
            "onSliderDrag": apply,
            "onChange": apply
        }
    };

    var strokeColorPicker = {
        view: "colorpicker",
        id: "stroke_colorpicker",
        label: "Stroke color",
        labelPosition: "top",
        value: "blue",
        on: {
            "onChange": apply
        }
    };
    var fillTemp = "<span style='background-color:#fill#; border-radius:4px; padding-right:10px;'>&nbsp</span>";
    var nav = {
        //  width: 220,
        header: "Annotations",
        id: "spx_tools",
        collapsed: true,
        body: {
            rows: [
                { view: "template", template: "Single rater properties", height: 30 },
                opacitySlider,
                strokeSlider,
                strokeColorPicker,
                { view: "template", template: "Multi rater properties", height: 30 },
                mOpacitySlider,
                { gravity: 0.1 },
            ]
        }
    };


    var combo = {
        view: "combo",
        label: 'Rater1',
        options: spxData,
        on: {
            "onChange": function(newv, oldv) {
                //webix.message("Value changed from: " + oldv + " to: " + newv);
                $$("rater1info").setValues({ id: newv });
                $(".boundaryClass").remove();
                $(".rater1").remove();
                $(".rater2").remove();
                spxData.forEach(function(r, idx)
                    {
                        if (r.value == newv) {
                            // console.log(r);
                            spxList = r['spxList'];
                            //  $(".boundaryClass").css('opacity', 0) //first set it all to 0
                            // console.log(spxList);
                            spxList.forEach(function(spxId)

                                {
                                    //                          $("#boundaryLI"+spxId).css('opacity',1);
                                    // $("#boundaryLI"+spxId).css('fill','red');
                                    tile = currentImgTileDict[spxId];
                                    node = d3.select(overlay.node())
                                        .append('polygon')
                                        //  .style('fill', 'red')
                                        .attr('points', tile.geometry.coordinates.join(' '))
                                        // .attr('class', 'boundaryClass')
                                        .attr('id', 'rtr1_boundaryLI' + tile.properties.labelindex)
                                        .style('opacity', 0.5)
                                        .attr('class', 'rater1')



                                })
                        }

                    })


            }
        }
    };



    var comboTwo = {
        view: "combo",
        label: 'Rater2',
        options: spxData,
        on: {
            "onChange": function(newv, oldv) {
                //webix.message("Value changed from: " + oldv + " to: " + newv);
                $$("rater2info").setValues({ id: newv });

                $(".rater2").remove();

                spxData.forEach(function(r, idx)

                    {
                        if (r.value == newv) {
                            console.log(r);

                            spxList = r['spxList'];
                            //$(".boundaryClass").css('opacity', 0)//first set it all to 0

                            spxList.forEach(function(spxId)

                                {


                                    tile = currentImgTileDict[spxId];

                                    node = d3.select(overlay.node())
                                        .append('polygon')
                                        // .style('fill', 'green')
                                        .attr('points', tile.geometry.coordinates.join(' '))
                                        .attr('class', 'boundaryClass')
                                        .attr('id', 'rtr2_boundaryLI' + tile.properties.labelindex)
                                        .style('opacity', 0.3)
                                        .attr('class', 'rater2')




                                })
                        }

                    })


            }
        }
    };
    //                 .attr('class', 'boundaryClass')

    function loadImageData(imgDataDict) {

        /* This should be passed a dictionary containing the imageName, tileSource for the
            base image, tileSource for the superpixel image, and the svgJSON file as well
            it should then clear all the appropriate combo boxes, refresh the image viewer, etc*/

    }


    const controlPanel = {
        rows: [{
                cols: [
                    combo,
                    comboTwo,
                    {
                        view: "button",
                        id: "my_button",
                        value: "Change Spx Opacity",
                        type: "form",
                        inputWidth: 100,
                        click: function(ev) {
                            webix.message(ev)
                            $(".boundaryClass").css('opacity', Math.random())
                        }
                    },
                    {
                        view: "button",
                        id: "button2",
                        value: "ClearResults",
                        inputWidth: 200,
                        click: function(ev) {
                            $(".boundaryClass").css('opacity', 0) //first set it all to 0
                            $(".rater1").remove() //first set it all to 0
                            $(".rater2").remove() //first set it all to 0
                        }
                    },
                    {
                        view: "button",
                        id: "button3",
                        value: "changeImage",
                        inputWidth: 200,
                        click: function(ev) {
                            webix.message("Change is good!")

                            $$("curImageId").setValues(imageData[1]);

                            ts = imageData[1].tileSource;

                            svgFile = imageData[1].svgFile;
                            zoomer.open(ts);
                        }

                    }
                ]
            },
            {
                cols: [
                    { view: "template", template: "#imageName#", id: "curImageId", data: { imageName: "" } },
                    { view: "template", type: "header", id: "rater1info", template: "#id#", data: { id: "" } },
                    { view: "template", template: "#id#", id: "rater2info", data: { id: "" } }

                ]
            },
        ]
    }

    const viewerPanel = {
        id: "slide_viewer",
        header: "Slide Viewer",
        body: {
            rows: [

                controlPanel,
                {
                    view: "template",
                    content: "image_viewer"
                }
            ]
        }
    };

    const main_layout = {
        container: "main_layout",
        id: "app",
        rows: [{
            cols: [
                viewerPanel,
                nav
            ]
        }]
    };



    webix.ui(main_layout);

    colorPalette = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]

    function handleMouseOver(d, i) {
        // self.deselectCell(d3.select(overlay.node()).selectAll('.boundaryClass'));
        // self.selectCell(d3.select(overlay.node()).select('#' + this.id));

        console.log(d, i)
    }



    const imageData = [{
            imageName: "ISIC_0016127",
            tileSource: [
                { width: 3008, tileSource: { type: 'image', url: 'sampleData/ISIC_0016127.jpg' } },
                { opacity: 0.1, tileSource: { type: 'image', url: 'sampleData/ISIC_0016127_superpixels_v3.0.png' } }
            ],
            svgFile: "sampleData/ISIC_0016127_superpixels_v3.0.png.svg.json"
        },
        {
            imageName: "ISIC_0016081",
            tileSource: [
                { width: 3008, tileSource: { type: 'image', url: 'sampleData/ISIC_0016081.jpg' } },
                { opacity: 0.1, tileSource: { type: 'image', url: 'sampleData/ISIC_0016081_superpixels_v3.0.png' } }
            ],
            svgFile: "sampleData/ISIC_0016081_superpixels_v3.0.png.svg.json"
        }

    ]




    var overlay = zoomer.svgOverlay();


    webix.ready(function() {

        idx = 0;
        ts = imageData[idx].tileSource;

        svgFile = imageData[idx].svgFile;
        zoomer.open(ts);

        //      overlay = zoomer.svgOverlay();



        // var d3Rect = d3.select(overlay.node()).append("rect")
        //     .style('fill', '#f00')
        //     .attr("x", 0.5)
        //     .attr("width", 0.25)
        //     .attr("y", 0.5)
        //     .attr("height", 0.25);


        currentImgTileDict = {};


        $.get(svgFile).done(function(data) {

            currentImgTileData = data;

            data.forEach(function(tile, index) {

                //              console.log(index,tile);
                // console.log(tile['geometry'])
                fillColor = colorPalette[index % 10];
                //console.log(fillColor);

                node = d3.select(overlay.node())
                    .append('polygon')
                    .style('fill', fillColor)
                    .attr('points', tile.geometry.coordinates.join(' '))
                    .attr('class', 'boundaryClass')
                    .attr('id', 'boundaryLI' + tile.properties.labelindex)
                    .style('opacity', 0.1)
                    .attr('class', 'boundaryClass')

                    .on('mouseover', handleMouseOver);

                //            console.log(node);

                currentImgTileDict[tile.properties.labelindex] = tile;
            })


        })


    });
});