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
        },
        {
            id: "hideSVG_btn",
            label: "Hide SPX",
            view: "button",
            click: function () {console.log('hi');}

        }]
    }

    return {
        buttons: buttons
    }
});