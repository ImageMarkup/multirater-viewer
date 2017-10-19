define(["ui", "webix"], function(ui) {
    webix.ready(function() {
        ui.init();
	$$("slide_viewer").expand();
    });
});
