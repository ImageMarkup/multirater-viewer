define(["webix", "zoomer", "tiles", "navPanel", "svgControlPanel", "d3", "config"], function(webix, zoomer, tiles, navPanel, svgControlPanel, d3, config) {


    qryUrl = config.apiBaseUrl + "/folder?parentId=" + config.startFolder + "&parentType=collection";
    console.log(qryUrl);
    var imageListCombo = {
        view: "combo",
        id: "localImageListCombo",
        label: 'ImageSelector',
        options: {
            body: {
                template: "#name#" //set this from the config
            }
        },
        on: {

            onAfterRender: webix.once(function() {
                //probably a cleaner way to load the data from girder
                //this will populate the combo box on initial load and also
                //set the first box as selected
                webix.ajax(qryUrl).then(function(data) {
                    $$("localImageListCombo").getList().parse(data);

                    //$$("localImageListCombo")
                    // ombo.getList().clearAll();
                    // combo.getList().parse( new_options )
                }).finally(function() {
                        fId = $$("localImageListCombo").getList().getFirstId();
                        $$("localImageListCombo").setValue(fId);
                 })
            })

        }

        // //template: "#_id#",
        // options:{
        //     template:"#name#",
        // }
    }



    const viewerPanel = {
        id: "slide_viewer",
        header: "Slide Viewer",
        body: {
            rows: [
                svgControlPanel.controlPanel,
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
        rows: [
            { view: "layout", rows: [imageListCombo] },

            {
                cols: [
                    viewerPanel,
                    //                navPanel.navPanel
                ]
            }
        ]
    };



    webix.ui(main_layout);

    // colorPalette = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]

    // function handleMouseOver(d, i) {
    //     // self.deselectCell(d3.select(overlay.node()).selectAll('.boundaryClass'));
    //     // self.selectCell(d3.select(overlay.node()).select('#' + this.id));
    //     console.log(d, i)
    // }


    // var overlay = zoomer.svgOverlay();
    webix.ready(function() {
        // idx = 0;
        // console.log(navPanel.imageData)
        // curImgInfo = navPanel.imageData['ISIC_0016127'];
        // console.log(curImgInfo)

        // ts = curImgInfo.tileSource;
        // svgFile = curImgInfo.svgFile;
        // imageName = curImgInfo.imageName;


        firstId = $$("localImageListCombo").getPopup().getList().getFirstId();
        $$("localImageListCombo").setValue(firstId);
        webix.message(firstId)


        // $$("curImageId").parse({ "imageName": imageName })


        // zoomer.open(ts);

        // currentImgTileDict = {};
        // $.get(svgFile).done(function(data) {

        //     currentImgTileData = data;
        //     data.forEach(function(tile, index) {
        //         fillColor = colorPalette[index % 10]; //I want each SVG tile to have a uniqueish color

        //         node = d3.select(overlay.node())
        //             .append('polygon')
        //             .style('fill', fillColor)
        //             .attr('points', tile.geometry.coordinates.join(' '))
        //             .attr('class', 'boundaryClass')
        //             .attr('id', 'boundaryLI' + tile.properties.labelindex)
        //             .style('opacity', 0.1)
        //             .on('mouseover', handleMouseOver);
        //         //            console.log(node);
        //         currentImgTileDict[tile.properties.labelindex] = tile;
        //     })
        // })

    });
});