import { JetView } from "webix-jet";
const d3 = require("d3");
const $ = require("jquery");
const webix = require("webix");

export default class raterInfoDataTable extends JetView {
    config() {
        var cSt =
            "<span style='background-color:#raterColor#; border-radius:4px; padding-right:10px;'>&nbsp</span>";

        /* Need to add a raterClass name that gets rid of periods and blank spaces as it breaks the JS model */
        // I need to remove spaces from the raterClass or it breaks everything!

        var raterInfoDataTable = {
            view: "datatable",
            id: "raterInfoDataTable",
            yCount: 7,
            // height: 150, //TO FIX.. this shuold not be fixed height
            columns: [
                { id: "raterName", header: "Rater Name", width: 50, hidden: true },
                { id: "raterClassName", width: 100, header: "Rater" },
                {
                    id: "raterColor",
                    editor: "color",
                    template: cSt,
                    header: "Color",
                    width: 50,
                },
                {
                    id: "raterTotalFeaturesSeen",
                    header: [{ text: "# Features Seen", css: "multiline" }],
                    width: 100,
                },
                {
                    id: "spxMarkedForCurrentFeature",
                    header: "# Spxs Marked",
                    tooltip: "# of superpixels the rater selected",
                    width: 180,
                },
                {
                    id: "showRaterMarkupCheckbox",
                    width: 180,
                    header: "DisplayMarkup",
                    checkValue: "on",
                    uncheckValue: "off",
                    value: "on",
                    template: "{common.checkbox()}",
                },
            ],
            editable: true,
            gravity: 1,
            tooltip: true,
            $scheme: {
                $change: function(obj) {
                    console.log(obj);
                    obj.raterClassName = obj.raterName; //.replace('/\s/g', '');
                },
            },
            on: {
                onCheck: function(rowId, colId, state) {
                    var curItem = $$("raterInfoDataTable").getItem(rowId);
                    console.log(curItem);

                    if (curItem.showRaterMarkupCheckbox == "on") {
                        $("." + curItem.raterClassName).css("opacity", 0.6);
                    } else {
                        $("." + curItem.raterClassName).css("opacity", 0);
                    }
                },
                onAfterEditStop: function(state, editor) {
                    var rowInfo = this.getItem(editor.row);
                    console.log(rowInfo);
                    if (editor.column == "raterColor" && state.value != state.old) {
                        //webix.message("color changed to" + state.value);
                        $("." + rowInfo.raterClassName).css("fill", state.value);
                    }
                },
            },
        };
        return raterInfoDataTable;
    }
}