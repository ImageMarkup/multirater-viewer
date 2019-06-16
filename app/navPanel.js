define("navPanel", ["webix","config","sampleData"], function(webix,config,sampleData) {
    console.log(sampleData)

    

    


    //         markupDataDict = {
    //     "ISIC_0016081": [
    //         { "id": "Dots : Irregular--marghooa--ISIC_0016081", "spxList": [318, 333, 358, 369, 436, 475, 520, 534, 557, 560, 561, 629, 635, 639] },
    //         { "id": "Dots : Irregular--braunr--ISIC_0016081", "spxList": [436, 561] },
    //         { "id": "Dots : Irregular--susipuig--ISIC_0016081", "spxList": [388, 391, 396, 436, 439, 454, 456, 475, 561, 592, 603, 604, 642] },
    //         { "id": "Globules / Clods : Irregular--marghooa--ISIC_0016081", "spxList": [359, 369, 388, 436, 475, 561, 655] },
    //         { "id": "Lines : Pseudopods--marghooa--ISIC_0016081", "spxList": [333, 336, 342, 359] },
    //         { "id": "Lines : Pseudopods--braunr--ISIC_0016081", "spxList": [271, 293, 301, 308, 342, 359] },
    //         { "id": "Lines : Pseudopods--harald--ISIC_0016081", "spxList": [289, 301] },
    //         { "id": "Lines : Radial streaming--marghooa--ISIC_0016081", "spxList": [271, 276, 289, 293, 359] },
    //         { "id": "Lines : Radial streaming--braunr--ISIC_0016081", "spxList": [271, 276, 289, 342, 359] },
    //         { "id": "Network : Atypical pigment network / Reticulation--marghooa--ISIC_0016081", "spxList": [271, 276, 287, 292, 301, 308, 311, 318, 321, 343, 371, 381, 427, 597, 624, 633, 671, 673, 679, 684, 702, 729, 731] },
    //         { "id": "Network : Atypical pigment network / Reticulation--braunr--ISIC_0016081", "spxList": [329, 333, 342, 351, 352, 369, 388, 390, 392, 420, 422, 429, 431, 456, 488, 507, 524, 534, 546] },
    //         { "id": "Network : Atypical pigment network / Reticulation--susipuig--ISIC_0016081", "spxList": [271, 276, 287, 289, 292, 301, 308, 311, 316, 318, 321, 325, 329, 333, 341, 342, 343, 351, 352, 354, 358, 359, 369, 381, 388, 390, 420, 422, 427, 428, 429, 430, 445, 463, 488, 493, 502, 507, 523, 524, 534, 544, 546, 549, 557, 563, 575, 578, 589, 592, 597, 608, 624, 629, 633, 635, 636, 649, 650, 658, 664, 669, 671, 673, 679, 684, 692, 702, 729, 731] },
    //         { "id": "Network : Broadened pigment network / Reticulation--braunr--ISIC_0016081", "spxList": [271, 276, 287, 292, 311, 321, 325, 343, 381, 597, 624, 633, 673, 684, 702, 729] },
    //         { "id": "Network : Broadened pigment network / Reticulation--harald--ISIC_0016081", "spxList": [271, 276, 287, 292, 311, 321, 343, 351, 354, 381, 390, 575, 597, 624, 650, 664, 671, 673, 679, 684, 699, 702] },
    //         { "id": "Regression structures : Peppering / Granularity--braunr--ISIC_0016081", "spxList": [358, 603, 617, 642] },
    //         { "id": "Regression structures : Peppering / Granularity--susipuig--ISIC_0016081", "spxList": [358, 439, 475, 492, 495, 520, 534, 539, 561, 603, 604, 642, 643, 655, 664] },
    //         { "id": "Structureless : Blotch irregular--braunr--ISIC_0016081", "spxList": [329, 341, 439, 492, 508, 542, 554, 613] }
    //     ],
    //     "ISIC_0016127": [
    //         { "id": "Globules / Clods : Irregular--marghooa--ISIC_0016127", "spxList": [476, 504, 506, 511, 532, 539] },
    //         { "id": "Globules / Clods : Irregular--braunr--ISIC_0016127", "spxList": [462, 466, 469, 470, 476, 504, 506, 511, 532, 545, 557] },
    //         { "id": "Globules / Clods : Irregular--harald--ISIC_0016127", "spxList": [426, 447, 462, 466, 469, 470, 476, 489, 504, 506, 511, 532, 545, 552, 557] },
    //         { "id": "Vessels : Dotted--marghooa--ISIC_0016127", "spxList": [370, 372, 373, 399, 400, 413, 435, 438, 474, 514, 524, 535, 570, 572, 604] },
    //         { "id": "Vessels : Dotted--braunr--ISIC_0016127", "spxList": [370, 394, 400, 413, 418, 435, 438, 451, 473, 474, 496, 514, 524, 535, 544, 570, 572, 584, 593, 604, 610] },
    //         { "id": "Vessels : Dotted--harald--ISIC_0016127", "spxList": [359, 370, 394, 400, 413, 435, 438, 451, 473, 474, 496, 514, 524, 535, 570, 572, 604, 610] }
    //     ]
    // }


//http://localhost:8080/api/v1/folder?parentType=collection&parentId=5cf1787ed16d75389fb8fffc&limit=50&sort=lowerName&sortdir=1


  
  imageListCombo = {}
//http://localhost:8080/api/v1/folder?parentType=collection&parentId=5cf1787ed16d75389fb8fffc&limit=50&sort=lowerName&sortdir=1



    spxData = sampleData.markupData['ISIC_0016081']

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




    return { navPanel: nav, imageListCombo: imageListCombo, imageData:sampleData.imageData}

}); 