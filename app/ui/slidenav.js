define("ui/slidenav", ["config", "zoomer", "slide"], function(config, zoomer, slide){

	var folderName = null;
	var patientId = null;

	setDropdown = { 
		view:"combo",  
        placeholder:"Select Slide Set",
        id: "slideset_list",
        options:{
			body:{
				template:"#name#",
				url: config.BASE_URL + "/folder?parentId=57ed673c2f9b2e54ae833a24&parentType=folder"
				//This is changed from Girder Organization on ISIC which referred to "dataset"
			}
        },
        on:{
        	"onChange": function(id){
            	var item = this.getPopup().getBody().getItem(id);
            	folderName = item.name;
            	var thumbs = $$("thumbnails_panel");
                var url = config.BASE_URL + "/folder?parentId=" + item._id + "&parentType=folder";
                //This was changed from the way we get images natively using the ISIC API
                //vs standard girder version...
                console.log(url);
                thumbs.clearAll();
                thumbs.load(url);
          	}
    	}
	};

	thumbnailsPanel = {
		view: "dataview",
        id: "thumbnails_panel",
        select: true,
        // template: "<div class='webix_strong'>#name#</div><img src='"+ config.BASE_URL +"/image/#_id#/thumbnail?width=180'/>",
        template: "<div class='webix_strong'>#name#</div><img src='"+ config.BASE_URL +"/item/580544782f9b2e1d33611bf9/download' width=180 />",
        datatype: "json",
        type: {height: 170, width: 200},
        ready: function(){
        	var item = this.getItem(this.getFirstId());
            patientId = item.name;
            slideObj = slide.init(item._id);
            data = slideObj.data();
            
            var tileSource = {
				type: 'legacy-image-pyramid',
				levels: [{
					
					url: config.BASE_URL +"/v1/image/558d6082bae47801cf73435d/thumbnail?disposition=inline&.jpg",			
					height: 1000,
					width: 1000
				}]
			};
		// height:  data.meta.acquisition.pixelsY,
					// width: data.meta.acquisition.pixelsX
// url: "http://digitalslidearchive.emory.edu:7070/" + folderName + "/" + patientId + "/" + patientId + ".jpg",
			zoomer.viewer.open(tileSource);	
        },
        on: {
         	"onItemClick": function(id, e, node) {
             	item = this.getItem(id);
             	patientId = item.name;
             	slideObj = slide.init(item._id);
             	data = slideObj.data();
             	
             	slideObj.annotations();
	            var tileSource = {
					type: 'legacy-image-pyramid',
					levels: [{
						url: "http://digitalslidearchive.emory.edu:8080/" + folderName + "/" + patientId + "/" + patientId + ".jpg",
						height:  data.meta.acquisition.pixelsY,
						width: data.meta.acquisition.pixelsX
					}]
				};

				zoomer.viewer.open(tileSource);
           	}
      	}
    };

 function getFiles( itemId) {
            var obj = this;

            // $.get(config.BASE_URL + "/item/" + itemId + "/files")
            //  .then(function(files){
            //     this.files = files;
            //     console.log("FILES: ", this.files);

            //     $.each(files, function(key, file) {
            //         if (file.mimeType == "application/xml") {
            //             obj.annotations.push(file);
            //         }
            //     });
            //  });

            //  console.log("ANNOTATIONS: ", this.annotations);
        }



	nav = {
		width: 220,
		rows: [
			setDropdown, 
			thumbnailsPanel
		]
	};

	return{
		view: nav
	}

});



