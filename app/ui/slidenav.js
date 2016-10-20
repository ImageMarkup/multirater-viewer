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
				url: config.BASE_URL + "/folder?parentType=folder&parentId=" + config.FOLDER_ID
			}
        },
        on:{
        	"onChange": function(id){
            	var item = this.getPopup().getBody().getItem(id);
            	var thumbs = $$("thumbnails_panel");
                var url = config.BASE_URL + "/folder?parentType=folder&parentId=" + item._id
                thumbs.clearAll();
                thumbs.load(url);
          	}
    	}
	};

	thumbnailsPanel = {
		view: "dataview",
        id: "thumbnails_panel",
        select: true,
        template: "<div class='webix_strong'>#name#</div><img src='"+ config.BASE_URL +"/item/#meta.slideId#/tiles/thumbnail'/>",
        datatype: "json",
        type: {height: 170, width: 200},
        ready: function(){
        	var item = this.getItem(this.getFirstId());
        	console.log(item);
            slide.init(item);
        },
        on: {
         	"onItemClick": function(id, e, node) {
             	item = this.getItem(id);
             	console.log(item);
             	slide.init(item);
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