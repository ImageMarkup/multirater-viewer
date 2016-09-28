

var color20 = d3.scale.category20();


        //activate buttons
        //slide.HasAperioXML ? $$("aperio_import_btn").enable() : $$("aperio_import_btn").disable();

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
        d3.select(svg_layer.node()).append("polygon").attr("points", point_list.coords).style('fill', 'none').attr('opacity', 0.4).attr('class', 'tileClass').attr('id', 'tile' + point_list.labelindex)
    });


}