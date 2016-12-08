define("features", ["jquery", "tiles"], function($, tiles){

	var features = {
		groups: {},

		init: function(data){
			this.data = data;
			this.group();
			this.widget();

		},

		group: function(){
			var grp = {};
			$.each(this.data, function(id, feature) {
            	groupName = feature.name[0];
				grp[groupName] = grp[groupName] || [];
            	
                grp[groupName].push({
                    id: feature.id,
                    group: feature.name[0],
                    name: feature.name[1]
                })
        	});

			this.groups = grp;
		},

		reset: function(){
			this.buttons.map(function(btn){
				$$(btn.id).config.badge = 0;
				$$(btn.id).refresh();
			})
		},

		setRaters: function(raters){
			this.raters = raters;
		},

		widget: function(raters, slide){
			/*$.each(this.groups, function(name, features){
				var rows = [];
				var cols = [];

				$.each(features, function(index, feature){
					cols.push({
						id: feature.id,
						view:"button", 
						width:110, 
						badge:0, 
						label:feature.name
					});

					if((index+1) % 3 == 0 || index == features.length-1){
						rows.push({
							cols: cols
						});
						cols = [];
					}
				});

				var item = {
                    view: "accordionitem",
                    header: name,
                    collapsed: true,
                    body: {
						rows: rows
					}
                };

				$$("feature_accordion").addView(item);
				console.log(rows);

			});*/

			var c = 1;
			var cols = [];
			var buttons = [];
			slide = this.slide;
			raters = this.raters;

			$.each(this.groups, function(name, features){
				$.each(features, function(index, feature){
					btn = {
						id: feature.id,
						view:"button", 
						width:110, 
						badge:0, 
						label: feature.name + "<br/>" + name,
						width:90,
						height:50,
						type:"iconTop",
						css: "feature_button",
						on:{
				            onItemClick: function(id){
				               	//tiles.removeOverlay();
				               	console.log(id, raters);
				               	console.log(slide.tiles);
                				//tiles.addRaterOverlays(id, raters, slide.tiles);
				            }
        				}
					};

					buttons.push(btn); 
					cols.push(btn);

					if(c % 2 == 0){
						$$("feature_list").addView({cols: cols});
						cols = [];
					}

					c++;
				});
			});

			this.buttons = buttons;
		}
	}
		
	return features;
});