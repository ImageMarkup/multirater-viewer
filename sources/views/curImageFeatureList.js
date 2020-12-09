import { JetView } from "webix-jet";
import * as tileInfo from "./subviews/osd/tileHelperFunctions";
const webix = require("webix");
const $ = require("jquery");

export default class curImageFeatureList extends JetView {
  config() {
    const featureAccordion = {
      view: "form",
      id: "curImgFeatureList",
      gravity: 0.5,
      elements: [],
    };

    const curPixelInfo = {
      gravity: 0.1,
      view: "template",
      id: "curPixelInfo",
      template: "#curPixelId# #ratersForSpx# <br>#featuresSeen#",
      data: { curPixelId: "", ratersForSpx: "", featuresSeen: "" },
    };

    const curImageFeatureList = {
      rows: [
        {
          view: "template",
          type: "header",
          template: "Features Present In Image",
        },
        featureAccordion
      ],
    };

    return {
      name: "curImageFeatureList",
      width: 400,
      rows: [curImageFeatureList, curPixelInfo]
    };
  }
}