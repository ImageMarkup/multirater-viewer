define("svgSPX", ["pubsub",  "jquery", "zoomer","d3"], function(pubsub, $, viewer,d3) {

    var svgSPX = {
        init: function(item) {
            $.extend(this, item);
            this.viewer();
            this.keyvalue();
            this.initDataViews();
            this.superPixels();
            pubsub.publish("svgSPX", this);
            return this;
        },

       SVGfromBoundary: function( lesionBoundary_Dict, img_width)
       	{
       		//Need to convert the lesion Boudnary object which is in raw pixels into
       		//the proper coordinate system form Openseadragon
   		    scale_factor = 1;
		    polygon_list = [];
		    //Openseadragon uses the image width for bo the x and y scale factor... probably should rename this pixel factor
		    x_scale_factor = 1.0 / img_width;
		    y_scale_factor = 1.0 / img_width;
		    $(".boundaryClass").remove(); //Remove all previous boundaries I had appended to the DOM
		    							//may move this to a separate functino at some point

       	}

//     console.log('should be trying to render the boundary now!?');
//     console.log(lesionBoundary_Dict);



//     // $.each(contours, function(index, contour) {
//     //     coord_info = contour.geometry.coordinates;
//             coord_info = lesionBoundary_Dict.lesionBoundary.geometry.coordinates[0];
//             console.log(coord_info);
//          coord_string = "";
//          $.each(coord_info, function(k, v) {
//                  console.log(k,v[0],v[1]);
//                  coord_string += `${(v[0]* x_scale_factor ) },${ ( v[1] * y_scale_factor) } `;
//              }) // the |0 made them all integers
//          console.log(coord_string);
//        // polygon_svg_str = `<polygon points="${coord_string}" style="fill:${colours[ random(9)]};stroke;purple;stroke-width:1;opacity:0.5" id="boundary0" class="boundaryClass" />`;
//     //     labelindex = contour.properties.labelindex;
//          d3.select(svg_layer.node()).append("polygon").attr("points", coord_string).style('fill', 'blue').attr('opacity', 0.2).attr('class', 'boundaryClass').attr('id', 'boundary0');
//          //.attr('stroke','blue');
//     // });
//     //     polygon_list.push({
//     //         'coords': coord_string,
//     //         'labelindex': contour.properties.labelindex
//     //     });
//     // });

//     // return svg_shape;

// }






        return svgSPX
    }


});
