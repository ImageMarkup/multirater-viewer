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
				url: config.BASE_URL + "/dataset"
			}
        },
        on:{
        	"onChange": function(id){
            	var item = this.getPopup().getBody().getItem(id);
            	folderName = item.name;
            	var thumbs = $$("thumbnails_panel");
                var url = config.BASE_URL + "/image?datasetId=" + item._id;
                thumbs.clearAll();
                thumbs.load(url);
          	}
    	}
	};

	thumbnailsPanel = {
		view: "dataview",
        id: "thumbnails_panel",
        select: true,
        template: "<div class='webix_strong'>#name#</div><img src='"+ config.BASE_URL +"/image/#_id#/thumbnail?width=180'/>",
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
					url: "http://digitalslidearchive.emory.edu:7070/" + folderName + "/" + patientId + "/" + patientId + ".jpg",
					height:  data.meta.acquisition.pixelsY,
					width: data.meta.acquisition.pixelsX
				}]
			};

			zoomer.viewer.open(tileSource);	
        },
        on: {
         	"onItemClick": function(id, e, node) {
             	item = this.getItem(id);
             	patientId = item.name;
             	slideObj = slide.init(item._id);
             	data = slideObj.data();
             	
	            var tileSource = {
					type: 'legacy-image-pyramid',
					levels: [{
						url: "http://digitalslidearchive.emory.edu:7070/" + folderName + "/" + patientId + "/" + patientId + ".jpg",
						height:  data.meta.acquisition.pixelsY,
						width: data.meta.acquisition.pixelsX
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