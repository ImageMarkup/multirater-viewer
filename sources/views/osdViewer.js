import { JetView } from "webix-jet";
const OpenSeadragon = require("openseadragon");

var duomo = {
  Image: {
    xmlns: "http://schemas.microsoft.com/deepzoom/2008",
    Url: "//openseadragon.github.io/example-images/duomo/duomo_files/",
    Format: "jpg",
    Overlap: "2",
    TileSize: "256",
    Size: {
      Width: "13920",
      Height: "10200",
    },
  },
};

webix.protoUI(
  {
    name: "osdViewer", //give it some name you like
    $init: function (config) {
      this.$ready.push(this.createOSDViewer);
      this.$ready.push(this.statusMessage);
      this.$ready.push(this.afterLoadedHandler);
      //    this.$ready.push(this.viewer.svgOverlay());
    },
    createOSDViewer: function () {
      //webix.message("Viewer ready event fired");
      this.viewer = new OpenSeadragon({
        element: this.getNode(),
        prefixUrl: "sources/images/images/",
        tileSources: duomo,
        navigatorPosition: "BOTTOM_RIGHT",
        showNavigator: true,
      });
      //webix.message("Viewer creation should be finished");
    },
    afterLoadedHandler: function()
    {   
      this.viewer.addHandler('open', function(event) {
      console.log("Hello gulliver");
        var tiledImage = event.item;
      tiledImage.addHandler('fully-loaded-change', function() {
        var newFullyLoaded = areAllFullyLoaded();
        if (newFullyLoaded !== isFullyLoaded) {
          isFullyLoaded = newFullyLoaded;
          // Raise event
          console.log('Locked and loaded')
        }
      })});
    },
      statusMessage: function () {
   //   webix.message("I fired the scalebar as well");
    },
  },
  webix.ui.view
);


export default class osdSVGClass extends JetView {
  config() {
    return {
      id: "slide_viewer",
      header: "A Slide Viewer",
      body: {
        rows: [
          {
            view: "template",
            template: "HI DAVE",
          },
        ],
      },
    };
  }
  init(view)
  {
      console.log('View Created')
  }

}