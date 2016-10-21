define("ui/toolbar", function() {

    buttons = {
        height: 30,
        cols: [{
            id: "apply_filter_btn",
            label: "Apply Filters",
            view: "button",
            click: ("$$('filters_window').show();")
        }, {
            id: "metadata_btn",
            label: "Metadata",
            view: "button",
            click: ("$$('metadata_window').show();")
        }]
    }

    return {
        buttons: buttons
    }
});