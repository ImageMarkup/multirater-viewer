define("svgControlPanel", ["webix","navPanel"], function(webix,navPanel) {
    webix.message("HELLO NAV")

        var combo = {
        view: "combo",
        label: 'Rater1',
        options: [],
        on: {
            "onChange": function(newv, oldv) {
                //webix.message("Value changed from: " + oldv + " to: " + newv);
                $$("rater1info").setValues({ id: newv });
                $(".boundaryClass").remove();
                $(".rater1").remove();
                $(".rater2").remove();
                spxData.forEach(function(r, idx) {
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
        options: [],
        on: {
            "onChange": function(newv, oldv) {
                //webix.message("Value changed from: " + oldv + " to: " + newv);
                $$("rater2info").setValues({ id: newv });
                $(".rater2").remove();

                spxData.forEach(function(r, idx) {
                    if (r.value == newv) {
                        console.log(r);
                        spxList = r['spxList'];
                        //$(".boundaryClass").css('opacity', 0)//first set it all to 0
                        spxList.forEach(function(spxId) {
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
                    navPanel.imageListCombo, 
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
                        view: "combo",
                        id: "imgSelectCombo",
                        value: 0,
                        options: [{ "id": 0, value: "ISIC_0016081" }, { "id": 1, value: "ISIC_0016027" }],
                        inputWidth: 200,
                        on: {
                            onChange: function(newv, oldv) {

                                $$("curImageId").setValues(navPanel.imageData[newv]);

                                ts = navPanel.imageData[newv].tileSource;

                                svgFile = navPanel.imageData[newv].svgFile;
                                zoomer.open(ts);
                            }
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


    return { controlPanel: controlPanel}

    	})