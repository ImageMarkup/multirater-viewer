import { JetView } from "webix-jet";
import $ from "jquery";
import state from "models/state";
import ThumbnailPanelService from "services/thumbnailPanel/thumbnailPanelService";
import constants from "../constants"

// var HOST_API_URL = "http://dermannotator.org:8080/api/v1";

function changeMainImage(imageData) {
    $(".raterClass").remove();
    $(".boundaryClass").remove();

    //Eventually load this from a remoet source..
    $$("slide_viewer").viewer.open({
        width: imageData.baseImageWidth,
        tileSource: constants.HOST_API_URL + "/item/" + imageData.mainImageId + "/tiles/dzi.dzi",
    });
}

export default class multiRaterThumbPanel extends JetView {
    config() {
        return {
            rows: [{
                    view: "toolbar",
                    padding: 3,
                    elements: [{
                            view: "icon",
                            tooltip: "Set filters",
                            localId: "toggleFiltersViewButton",
                            icon: "fas fa-sliders-h"
                        },
                        {
                            view: "label",
                            label: "MultiRaterThumbPanel",
                        }
                    ]
                },
                {
                    view: "pager",
                    template: "{common.prev()}{common.next()} Total: #count#  <div class='paging_text1'> Page {common.page()} from #limit#</div>",


                    localid: "thumbnailPager",
                    id: "thumbnailPager"
                },

                {
                    localId: "multiview",
                    value: "thumbnailPanel",
                    width: 150 * 2 + 20,
                    cells: [{
                            view: "dataview",
                            id: "thumbnailPanel",
                            pager: "thumbnailPager",
                            template: "<div class='webix_strong'>#imageName#<br><img src='#baseImageThumb#' height=120/></div>",
                            type: {
                                height: 120,
                                width: 150,
                            },
                            select: true,
                            on: {
                                onItemClick(id, e, node) {
                                    // console.log(id,e,node);
                                    var item = $$("thumbnailPanel").getItem(id);
                                    changeMainImage(item);
                                    state.curImageMetaData = item;
                                    //currentSelecetdItem = item; //updated curerntly selectee item.. currently in global  namespace
                                },
                            },
                        },
                        {
                            id: "thumbnailFilterPanel",
                            rows: [{
                                    template: "<div class='webix_strong'>Filters:</div>",
                                    autoheight: true,
                                    borderless: true
                                },
                                {
                                    view: "tree",
                                    localId: "filtersTree",
                                    borderless: true,
                                    type: "lineTree",
                                    scroll: "auto",
                                    css: "dataview-filters-tree",
                                    template: (obj, common) => {
                                        const tree = this.filtersTree;
                                        const checkboxState = tree.isSelected(obj.id) ? "checked fas fa-check-square" : "unchecked far fa-square";
                                        return `<span onmousedown='return false' onselectstart='return false'>${common.icon(obj, common)} <i class='tree-checkbox ${checkboxState}'></i> <span>${obj.name}</span></span>`;
                                    }
                                },
                                {
                                    view: "button",
                                    localId: "applyFilters",
                                    value: "Apply filters"
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    }
    init(view) {
        this._thumbnailPanelService = new ThumbnailPanelService(view);
    }

    get dataview() {
        return $$("thumbnailPanel");
    }

    get filtersTree() {
        return this.$$("filtersTree");
    }

    get filtersPanel() {
        return this.$$("thumbnailFilterPanel");
    }

    get toggleFilters() {
        return this.$$("toggleFiltersViewButton");
    }

    get multiview() {
        return this.$$("multiview");
    }

    get applyFiltersBtn() {
        return this.$$("applyFilters");
    }
}
