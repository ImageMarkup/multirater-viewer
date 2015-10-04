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
        $("#tile_info_stats").append(num_superpixels.toString() + ' superpixels are in this image');
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
                     console.log(raters_for_tile, tileID);
                        
                        if (raters_for_tile.length == 1)
                            {
                              //In this case the tile is colored for the individual rater.... otherwise it's a color palette
                            //Currently I am going 
                            //var a = fruits.indexOf("Apple");
                            rater_index = raters.indexOf(raters_for_tile[0])
                            console.log(raters_for_tile,rater_index)

                        $("#tile"+tileID).css('fill',colours[rater_index]);

                            }
                        else{

                        $("#tile"+tileID).css('fill',color_heatmap[raters_for_tile.length]);
                          }

                 }

              });

       
      $(".tileClass").hover(function() {
                console.log(this.id);
                pixnum = (this.id).substring(4);
                $("#tile_info_stats").empty(); /// clear the current DIV before I start putting stats in it..
              $("#tile_info_stats").append(num_superpixels.toString() + ' superpixels are in this image');
              $("#tile_info_stats").append("<br>You are hovering on sp: "+this.id);
              

              tile_num = this.id.substring(4) ; //need to turn the tileID which actually is tile234 or similar into only the number part.. so skip the first 4 chars
              //Determine who marked up this file
              pix_raters = superpixel_markup_info[current_feature][tile_num];
              //remember this may contain ALL raters who assessed this feature, so need to make sure there's not a "0.0" there which means that rater
              //didn't actually mark that specific superpixel with the given feature
              rft = []
              $.each(pix_raters, function(k,v) { if ( v != '0.0') {rft.push(k); } })
              console.log(rft);
              $("#tile_info_stats").append("<br>Raters: "+JSON.stringify(rft));


            });

        };
