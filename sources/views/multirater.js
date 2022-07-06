import { JetView } from "webix-jet";
import { osdSVGClass } from "../views/osdViewer";
import osdMaskView from "./subviews/osd/osdMaskView";
import multiRaterThumbPanel from "./thumbnailPanel";
import curImageFeatureList from "./curImageFeatureList";
import raterInfoDataTable from "./raterInfoDataTable";

export default {
    cols: [
        multiRaterThumbPanel,
        {
            cols: [osdMaskView, { view: "resizer" }, { rows: [curImageFeatureList, { view: "resizer" }, raterInfoDataTable] }],
        },
    ],
};