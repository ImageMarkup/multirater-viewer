multiRaterHeader = { view: 'template', template: "ISIC Multirater Viewer", height: 50 }



imageSetList = ['ISIC_MSK-1_1', 'ISIC_MSK-2_1', 'ISIC_SONIC_1', 'ISIC_UDA-1_1', 'ISIC_UDA-2_1']


wbxImageSets = {
    view: "combo",
    id: 'field_t',
    label: 'Image Sets',
    value: imageSetList[0],
    options: imageSetList
}

/* This is the actual set of images associated with an image set */
wbxImageList = {
    view: "combo",
    id: 'field_t',
    label: 'Image List',
    value: imageSetList[0],
    options: imageSetList
}



navControlLayout = {
    width: 300,
    type: "space",
    rows: [wbxImageSets,wbxImageList]
}

webix.ready(function() {

    webix.ui({
        container: "multirater_layout",
        id: "wbx_layout",
        type: "space",
        rows: [multiRaterHeader, {
            cols: [navControlLayout, {
                    content: "osd_viewdiv",
                    autoheight: true,
                },
            ]
        }]
    })

});
