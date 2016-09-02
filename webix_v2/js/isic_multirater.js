
// function load_new_image(image_name) {
//     //Consolidating all of the function calls that need to be made when I switch an image into this snipper... this should be called
//     //on document ready, and attached to the SELECT element when it's changed.
//     //First remove all of the SVG elements to prevent the screen from flashing weird colors
//     $(".tileClass").remove();

//     image_filename_url = image_info_list[image_name].filename_url;
//     new_tile_source = {
//         'type': 'legacy-image-pyramid',
//         levels: [{
//             'url': image_filename_url,
//             'height': image_info_list[image_name].img_height,
//             'width': image_info_list[image_name].img_width,
//         }]
//     }
//     update_rater_overlays(image_name);
//     dg_viewer.open(new_tile_source);

//     //Now that the new image is loaded, should next load the actual markup data for this image
//     //I should call this function when I select an image...
//     //This gets the markup info for the currently selected image
//     $.getJSON('api/TileInfo/ALL/' + image_name, function(data) {
//         superpixel_markup_info = data;
//         //I am going to disable buttons on the feature list if that feature isn't present in the currnet image...
//         hide_unannotated_features(superpixel_markup_info);
//         new_mark_superpixels();
//     })

// }







/* Define Globals here */
var study_url = 'https://isic-archive.com/api/v1/study';
var avail_studies_dict = {};


$(document).ready( function()
{

load_avail_studies();

}






    )


webix.ready(function() {

    webix.ui({
        container: "multirater_layout",
        id: "wbx_layout",
        type: "space",
        rows: [{
            template: "html->isicmrv_header",
            autoheight: true
        }, {
            cols: [{
                    content: "leftpanel_selector",autoheight:true,
                }, {
                    view: "resizer"
                }, {
                    view:"template",
                    content: "osd_viewdiv",
                    width: 1200,
                    autoheight:true,
                },

            ]
        }]


    })

});


function load_avail_studies() {
    //This requires no parameters ; this gets the available study data
    first_studyid = ''; //Will keep track of the first_studyid and once the data is loaded, load the image set associated with it

    $.getJSON(study_url, function(data) {
        avail_studies = data;
        //I am going to disable buttons on the feature list if that feature isn't present in the current image...
        console.log(avail_studies);
        //Also now load the feature button by iterating through them
        $.each(avail_studies, function(k, v) {
                //      console.log(v,k);
                if (k == 0) {
                    first_studyid = v['_id']
                };

                dtoa = '<option id="' + v['_id'] + '" value="' + v['_id'] + '">' + v.name + '</option>'
                $("#data_source_dd").append(dtoa);
                avail_studies_dict[v.name] = v;
            })
            //Now that I have a list of all available studies, I can go ahead and populate the image list
            //This should use the function I defined above..
        load_image_list(first_studyid);
        // //console.log
        // load_feature_list(first_studyid); //This will populate the feature widget..
        // load_rater_list(first_studyid); //I think this is another endpoint...
        // return (avail_studies);
    });
}


//WTF
//https://isic-archive.com/api/v1/study/57591a6c9fc3c10903af6c67?/images


function load_image_list(study_uid) {

    var get_img_list_url = 'https://isic-archive.com/api/v1/study/' + study_uid + '/images/';

    $.getJSON(get_img_list_url, function(data) {
        new_img_list = data;
        //This currently returns an _id and a name _id: "54e77f6fbae478166c01e546"  name: "ISIC_0001160"
        //TO DO:  Load the image data now??
        ///Need to remember to first clear the image list
        //Now I need to iterate through each item and add it to the image list...
        first_imageuid = ''

        $("#image_list_dd").empty();
        $.each(new_img_list, function(k, v) {
            if (k == 0) {
                first_imageuid = v['_id']
            };
            var new_img = `<option id="${v['_id']}" value="${v['_id']}">${v['name']}</option>`;
            $("#image_list_dd").append(new_img);
        })
        $("#image_list_dd").select2(); //Reinitialize the dynamic search widget


       //So I now need to actually get some metadata for the first image, which then calls another function to load the data..
        get_image_data(first_imageuid);

    });

}
