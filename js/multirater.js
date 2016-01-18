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



function load_feature_list() {
//     //AJAX Call to hit the API EndPoint and get the list of features for the given project and/or Image
//     //I think to make the UI cleaner and so the buttons don't move around, we will load all of
//     avail_features = []
//     $.getJSON('api/FeatureList', function(data) {
//         avail_features = data['features'];
//         //I am going to disable buttons on the feature list if that feature isn't present in the currnet image...
//         console.log("newly available features are");
//         console.log(avail_features)

//         //Also now load the feature button by iterating through them
//         $.each(avail_features, function(v, k) {
//             //console.log(rb);
//             var rb = `  <button class="btn btn-xs feature_btns" data-toggle="tooltip" data-placement="top" title="${k}" id="feat_${k}" value="${k}" >${k}</button>`;
//             $("#feature_btn_group").append(rb);
//         });



//         $("#feature_btn_group").empty();
//         //Add in the needed code for an accordion group

//         $("#feature_btn_group").append('<div class="featurebtns-example"> <div class="panel-group" role="tablist" id="button-accordion">');


//         $.each(feature_groups, function(k, v) {
//             cur_grp = feature_groups[k];
//             console.log("ITERATING THIS FEATURE NOW!!", cur_grp.feature_group, cur_grp.feature_abbrev)
//                 //For each high level feature group, I want to now list all of the features associated with that group
//                 //   $("#feature_btn_group").append("<div>"+cur_grp.feature_group+"");

//             accord_data_header = `
//         <div class="panel panel-default featurebtns-example">
//             <div class="panel-heading">
//                 <h3 class="panel-title">
//                     <a data-toggle="collapse" data-parent="#button-accordion" href="#collapse${cur_grp.feature_group}">${cur_grp.feature_group}</a>
//                 </h3>
//             </div>
//             <div id="collapse${cur_grp.feature_group}" class="panel-collapse collapse ">
//                 <div class="panel-body button-panel">`;

//             accord_data_footer = `</div></div></div>`


//             //  $("#feature_btn_group").append(accord_data_header);
//             button_data_for_cur_grp = "";
//             $.each(avail_features, function(idx, feat) {
//                 if (feat.startsWith(cur_grp.feature_abbrev)) {
//                     feat_without_class = feat.replace(cur_grp.feature_abbrev + '_', '');

//                     //To save Space I am removing the feature Class i.e. net col oth
//                     var rb = `  <button class="btn btn-xs feature_btns" data-toggle="tooltip" data-placement="top" title="${feat}" id="feat_${feat}" value="${feat}" >${feat_without_class}</button>`;
//                     button_data_for_cur_grp += rb;
//                     //$("#feature_btn_group").append(rb);

//                     //console.log('MATCHED GROUP FOR:' + feat)
//                 };
//             })

//             $("#feature_btn_group").append(accord_data_header + button_data_for_cur_grp + accord_data_footer);

//             //$("#feature_btn_group").append(button_data_for_cur_grp);
//             //console.log(button_data_for_cur_grp);
//             console.log(accord_data_header + button_data_for_cur_grp + accord_data_footer);
//             //$("#feature_btn_group").append(accord_data_footer);




//         });

//         $("#feature_btn_group").append("</div></div>");



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

}


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

        button_data_for_cur_grp = [];
        $.each(full_feature_set, function(idx, feat) {
            //print "Should be lookining for";
            //console.log( cur_grp.feature_abbrev,feat);
            if (feat.startsWith(cur_grp.feature_abbrev)) {
                feat_without_class = feat.replace(cur_grp.feature_abbrev + '_', '');
                //To save Space I am removing the feature Class i.e. net col oth
                var rb = `  <button class="btn btn-xs feature_btns" data-toggle="tooltip" data-placement="top" title="${feat}" id="feat_${feat}" value="${feat}" >${feat_without_class}</button>`;
                button_data_for_cur_grp += rb;
            }
            //Now push the new radio buttons to that div
        });
        $("#featbtn_" + cur_grp['feature_group']).append(button_data_for_cur_grp);
    });
    $("#" + widget_div).accordion();
}


