define("ui/slidenav", ["config", "zoomer", "jquery"], function(config, zoomer, $){

	var folderName = null;
	var patientId = null;

	setDropdown = { 
		view:"combo",  
        placeholder:"Select Slide Set",
        id: "slideset_list",
        options:{
			body:{
				template:"#name#",
				url: config.BASE_URL + "/folder?parentType=folder&parentId=57ed673c2f9b2e54ae833a24"
			}
        },
        on:{
        	"onChange": function(id){
            	var item = this.getPopup().getBody().getItem(id);
            	folderName = item.name;
            	var thumbs = $$("thumbnails_panel");
                var url = config.BASE_URL + "/folder?parentType=folder&parentId=" + item._id;
                thumbs.clearAll();
                thumbs.load(url);
          	}
    	}
	};

	thumbnailsPanel = {
		view: "dataview",
        id: "thumbnails_panel",
        select: true,
        template: "<div class='webix_strong'>#name#</div>",
        datatype: "json",
        type: {height: 170, width: 200},
        ready: function(){
        	slide = this.getItem(this.getFirstId());
            patientId = slide.name;
            var url = config.BASE_URL + "/item?folderId=" + slide._id;
            var tileSource = {
				type: 'legacy-image-pyramid',
				levels: [{
					url: "http://digitalslidearchive.emory.edu:7070/" + folderName + "/" + patientId + "/" + patientId + ".jpg",
					height:  2848,
					width: 4288
				}]
			};

			zoomer.viewer.open(tileSource);	
        },
        on: {
         	"onItemClick": function(id, e, node) {
             	slide = this.getItem(id);
             	patientId = slide.name;
             	var url = config.BASE_URL + "/item?folderId=" + slide._id;
            	var tileSource = {
					type: 'legacy-image-pyramid',
						levels: [{
							url: "http://digitalslidearchive.emory.edu:7070/" + folderName + "/" + patientId + "/" + patientId + ".jpg",
							height:  2848,
							width: 4288
					}]
				};

				zoomer.viewer.open(tileSource);
           	}
      	}
    };

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