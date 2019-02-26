define(["ui", "webix"], function(ui,webix) {
    webix.ready(function() {
        ui.init();
	$$("slide_viewer").expand();
    });
});
