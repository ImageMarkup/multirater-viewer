//These functions were written by David A Gutman MD PhD Emory University
// Code is to help load and process data and load and manipulate SVG elements corresponding to user markups
function random(range) {
    return Math.floor(Math.random() * range);
}


function loadSVGTileData(imageName) {

    console.log('need to load svg data for' + imageName);
    SVG_file = image_info_list[imageName].superpixel_svg;
    img_height = image_info_list[imageName].img_height;
    img_width = image_info_list[imageName].img_width;

    new_geodata = function() {
        console.log('loading new geo data');
        geo_array = [];
        $.ajax({
            'async': false,
            'global': false,
            'url': SVG_file,
            'dataType': "json",
            'success': function(result) {
                $.each(result, function(i, contour) {
                    geo_array.push(JSON.parse(contour))
                });
                //GEO ARRAY IS NOW generated with contours... so can call another function to generate an SVG layer a well // 
            }
        });

        return geo_array;
    }();


    //  This will iterate through all the tiles and color them a different color to show the tile overlays
    $(".tileClass").remove();

    my_points = contourdata_to_shape(new_geodata, img_width);

    //This generates the pretty multicolor tile image
    $.each(my_points, function(k, point_list) {
        d3.select(svg_layer.node()).append("polygon").attr("points", point_list.coords).style('fill', 'none').attr('opacity', 0.5).attr('class', 'tileClass').attr('id', 'tile' + point_list.labelindex)
    });


}


    function new_mark_superpixels(sp_info) {
        $(".tileClass").css('fill', 'none');

        //need to add in the current_feature

        if (superpixel_markup_info[current_feature])  {
                num_superpixels = Object.keys(superpixel_markup_info[current_feature]).length; }
          else {  return; }


       // console.log(num_superpixels)
        $("#tile_info_stats").empty(); /// clear the current DIV before I start putting stats in it..
//        $("#tile_info_stats").append(num_superpixels.toString() + ' superpixels are in this image');
        //This code is very sensitive to on load events...
        $.each(superpixel_markup_info[current_feature], function(tileID, rater_data) {
        //         ///I am now iteration over each tile in the selected Image...
                 tileAnnotated = false;
                 raters_for_tile = [];

                //So because of the way we store the data, I need to iterate through each superpixel and determine which rater(s) marked it up.. then color things
                 $.each(rater_data, function(r, v) {
                     if (v != "0.0") {
//                        console.log(r,v,tileID);
                         tileAnnotated = true;
                         raters_for_tile.push(r);
                     }
                 });

                            if (tileAnnotated) {
                     //Now that I know the tile has been annotated, I need to render the results
                     //console.log(raters_for_tile, tileID);
                        
                        if (raters_for_tile.length == 1)
                            {
                              //In this case the tile is colored for the individual rater.... otherwise it's a color palette
                            //Currently I am going 
                            //var a = fruits.indexOf("Apple");
                            rater_index = raters.indexOf(raters_for_tile[0])
                           // console.log(raters_for_tile,rater_index)

                        $("#tile"+tileID).css('fill',colours[rater_index]);

                            }
                        else{
                        $("#tile"+tileID).css('fill',color_heatmap[raters_for_tile.length]);
                          }
                 }

              });

       
      $(".tileClass").hover(function() {
              //  console.log(this.id);
                pixnum = (this.id).substring(4);
                $("#tile_info_stats").empty(); /// clear the current DIV before I start putting stats in it..
//              $("#tile_info_stats").append(num_superpixels.toString() + ' superpixels are in this image');
              $("#tile_info_stats").append("<br>You are hovering on sp: "+this.id);
              

              tile_num = this.id.substring(4) ; //need to turn the tileID which actually is tile234 or similar into only the number part.. so skip the first 4 chars
              //Determine who marked up this file
              pix_raters = superpixel_markup_info[current_feature][tile_num];
              //remember this may contain ALL raters who assessed this feature, so need to make sure there's not a "0.0" there which means that rater
              //didn't actually mark that specific superpixel with the given feature
              rft = []
              $.each(pix_raters, function(k,v) { if ( v != '0.0') {rft.push(k); } })
              //console.log(rft);
              $("#tile_info_stats").append("<br>Raters: "+JSON.stringify(rft));


            });

        };


        function contourdata_to_shape(contours, img_width) {
            scale_factor = 1;
            polygon_list = [];

            //Openseadragon uses the image width for bo the x and y scale factor... probably should rename this pixel factor
            x_scale_factor = 1.0 / img_width;
            y_scale_factor = 1.0 / img_width;

            $.each(contours, function(index, contour) {
                coord_info = contour.geometry.coordinates;

                coord_string = "";
                $.each(coord_info, function(k, v) {
                        coord_string += `${(v[0]* x_scale_factor ) },${ ( v[1] * y_scale_factor) } `;
                    }) // the |0 made them all integers

                polygon_svg_str = `<polygon points="${coord_string}" style="fill:${colours[ random(9)]};stroke;purple;stroke-width:1;opacity:0.5" id="tile${contour.properties.labelindex}" class="tileClass" />`;
                labelindex = contour.properties.labelindex;

                polygon_list.push({
                    'coords': coord_string,
                    'labelindex': contour.properties.labelindex
                });
            });

            //Need to add the below function to a callback function for above..
            $(".tileClass").hover(function() {
                console.log(this.id)
            });
            return polygon_list;
        }


//Currently not actually doing anything with the feature.. or rater...!! need to add in handlers
 function color_some_tiles(rater, feature) {
            //given a feature and a rater and an image ID I should color the respective tiles on the super pixel image
            console.log("should be painting " + feature + "for " + rater);
            new_mark_superpixels(); // loadSVGTileData(imageName);
            //I think I am going to structure this to paint all tiles for all the raters...
        }

 function show_all_tiles() {
              //This will iterate through all the tiles and color them a different color to show the tile overlays
              //s$(".tileClass").remove()
              $(".tileClass").css( 'fill', function() { pixnum = this.id.substring(4); console.log( pixnum ); return color20( (pixnum %20 ))  } ); 
              }



//function load_feature_list() {
//     //AJAX Call to hit the API EndPoint and get the list of features for the given project and/or Image
//     //I think to make the UI cleaner and so the buttons don't move around, we will load all of
//     avail_features = []
//         $("#feature_btn_group").empty();
//         //Add in the needed code for an accordion group


//         annotated_feature_list = avail_features;

//         $("#feature_btn_group button").click(function() {
//             //console.log(this.id); // points to the clicked input button

//             current_feature = this.value;
//             $("#feature_info_stats").empty();
//             //ALSO ADDI N SOME STATS TO INDICATE HOW MANY TILES WERE MARKED FOR THIS FEATURE...
//             cfd = superpixel_markup_info[current_feature]; //Current Feature data
//             if (!cfd) {
//                 $("#feature_info_stats").append("Feature " + current_feature + " NOT in this image");
//             } else {
//                 $("#feature_info_stats").append("Feature" + current_feature + " present");
//             }


//             //So I need to check the state of the button to either draw or clear a given tile(s) colors for a rater..
//             cur_slider_value = OpacitySlider.val();
//             //     var new_opacity = (cur_opacity == 0) ? cur_slider_value : 0;
//             $('.tileClass').attr('opacity', cur_slider_value);
//             new_mark_superpixels();
//         })


//         $(".feature_btns").not('.disabled').first().button("toggle"); //this should select the first active button in the image set
//         console.log('did i select the first button?');
//         //  $(".feature_btns").first().button("toggle");  //this isn't working for this type of radio button... seems to set the active and focus attributes



//     })

//}


 function load_feature_list() {
        //AJAX Call to hit the API EndPoint and get the list of features for the given project and/or Image
        //I think to make the UI cleaner and so the buttons don't move around, we will load all of the buttons associated
        //with a project...
        avail_features = []
        $.getJSON('api/FeatureList', function(data) {
            avail_features = data['features'];
            //I am going to disable buttons on the feature list if that feature isn't present in the currnet image...
            console.log("newly available features are");
            console.log(avail_features)
                //Probably put the code to create the widget her eas well?
            current_feature_set = avail_features;
            create_featurelist_widget(current_feature_set, feature_groups, 'feature_accordion');
        });
    }


function create_featurelist_widget(full_feature_set, feature_grouping, widget_div) {
    //This will actually create the widget of buttons associated with a set of features
    //This creates an accordion, and will group the buttons based on a "top leavel" feature
    //which also serves as the name of the individual accordion piece

    $.each(feature_grouping, function(idx, cur_grp) {
        //So this actually creates the Top Level labels for the accordion widget, buttons need to be added after these are craetd
        console.log(idx, cur_grp);
        //First thing I need to do is create an h3 (or h4 ) tag for the group
        $("#" + widget_div).append(` <h4>${cur_grp['feature_group']}</h4><div id="featbtn_${cur_grp['feature_group']}"></div>`);
        //Now I need to figure out which buttons to add to this feature
        //TO DO:  REMEMBER F THE FEATURE GROUP HAS A SPACE... JAVASCRIPT WILL EXPLODE

        button_data_for_cur_grp = [];
        $.each(full_feature_set, function(idx, feat) {
            //print "Should be lookining for";
            //console.log( cur_grp.feature_abbrev,feat);
            if (feat.startsWith(cur_grp.feature_abbrev)) {
                feat_without_class = feat.replace(cur_grp.feature_abbrev + '_', '');
                //To save Space I am removing the feature Class i.e. net col oth
                
                //TO DO:  Need to figure out/clarify what class I should put this in so it actually displays
                var rb = `  <button class="feature_btns btn btn-xs" style="font-size:10px" data-toggle="tooltip" data-placement="top" title="${feat}" id="feat_${feat}" value="${feat}" >${feat_without_class}</button>`;
                button_data_for_cur_grp += rb;
            }
            //Now push the new radio buttons to that div
        });
        $("#featbtn_" + cur_grp['feature_group']).append(button_data_for_cur_grp);

    });
    $("#" + widget_div).accordion( {collapsible: true});
    //The accordion has now been created, add click handlers to the buttons
      // annotated_feature_list = avail_features;


      annotated_feature_list = avail_features;

      $("#feature_accordion button").click(function() {
            console.log(this.id); // points to the clicked input button
            current_feature = this.value;
           $("#feature_info_stats").empty();
                //ALSO ADDI N SOME STATS TO INDICATE HOW MANY TILES WERE MARKED FOR THIS FEATURE...
            cfd = superpixel_markup_info[current_feature]; //Current Feature data
            if (!cfd) {
                $("#feature_info_stats").append("Feature " + current_feature + " NOT in this image");
            } else {
                $("#feature_info_stats").append("Feature" + current_feature + " present");
            }
        //     //So I need to check the state of the button to either draw or clear a given tile(s) colors for a rater..
             cur_slider_value = OpacitySlider.val();
             cur_opacity = 100;
            var new_opacity = (cur_opacity == 0) ? cur_slider_value : 0;
            $('.tileClass').attr('opacity', cur_slider_value);
           new_mark_superpixels();
      //hide_unannotated_features(superpixel_markup_info);
              });
        

}


function get_image_annotation_data( study_id,image_id)
  {
    //So in order for the UI to function properly, I need to grab all of the annotations available for the currnetly displayed image, and then build
    //a new object that contains some summary information for the image...

    //The Study ID can be obtained from
    $("#data_source_dd").val();

    annotationsAvailable = 'https://isic-archive.com/api/v1/annotations?studyId=' + cur_studyId '&imageId=' + image_id ;


  }



function hide_unannotated_features(superpixel_markup_info) {
    console.log('should be hiding buttons');
    //Beacause we may have 30-50 features present, we do not want the observer to try and click on each button to "see" if a given feature is there
    //First I need to reset all the radio buttons to make them all clickable, then disable if not present
    //$("#feature_btn_group").button('reset');
    //avail_features list the features that have been detected in this image..
    img_avail_features = Object.keys(superpixel_markup_info);
    //var annotated_feature_list = ['net_typ', 'net_atyp', 'str_chrys','net_targ','ves_serp','ves_clods']; //will load these frim a file

    //TODO Need to clean up logic below; for some reason if I reset all the buttons above and then ran the below code, nothing got set
    //Not sure if I was running into a race condition?
    
    feats_in_cur_image = []

    $.each(annotated_feature_list, function(index, value) {
        //console.log(index, value);
        if (img_avail_features.indexOf(value) < 0) { //feature is not present
            //the ID of the feature buttons actually have feat_ prepended to the feature name..
            $("#feat_" + value).addClass('disabled');
            //console.log('I think I just this?? #feat_' + value);
            // $("#feat_net_targ").addClass('disabled');
            //console.log('CRAP');
        } else if (img_avail_features.indexOf(value) > -1) {
            $("#feat_" + value).removeClass('disabled');
            feats_in_cur_image.push(value);
        }
    });

    //I am adding in additional code to also push this list of features into a separate around

    console.log(feats_in_cur_image);
    $("#featbtn_ImageSpecific").empty();
    $("#featbtn_ImageSpecific").text(feats_in_cur_image.join(", "));
    //May want to add stats on counts??


$(function() {
    //Adding keyboard listnered to toggle the tiles on/off if I press the letter t (for toggle)
    $("body").keypress(function(event) {
        if (event.keyCode == 116) {
            cur_opacity = $('.tileClass').attr('opacity');
            //cur_slider_value = $("#slider").slider("option", "value");
            cur_opacity = 100;
            cur_slider_value = OpacitySlider.val();
            var new_opacity = (cur_opacity == 0) ? cur_slider_value : 0;
            $('.tileClass').attr('opacity', new_opacity);
        }
    });
});

}

