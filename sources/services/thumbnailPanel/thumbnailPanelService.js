import ajax from "services/ajaxActions";
import { localRaterData } from "models/localRaterData";
import { featureFilters } from "models/featureFilterSet";
import ThumbnailPanelModel from "models/thumbnailPanelModel";
import constants from "../../constants";

const HOST_API = constants.HOST_API_URL;

export default class ThumbnailPanelService {
	constructor(view) {
		this._view = view;
		const scope = view.$scope;
		this._dataview = scope.dataview;
		this._filtersTree = scope.filtersTree;
		this._filtersPanel = scope.filtersPanel;
		this._toggleFilters = scope.toggleFilters;
		this._multiview = scope.multiview;
		this._applyFiltersBtn = scope.applyFiltersBtn;
		this.init();
	}

	init() {
		const view = this._view;
		webix.extend(view, webix.ProgressBar);
		this._model = new ThumbnailPanelModel(this._filtersTree, this._multiview.getValue());
		this._filtersTree.sync(this._model.collection);
		//For now need to convert the localRateData into a flatter structure for visualization
		var imageData = []; //need to flatten the localRaterData for now
		// Object.keys(localRaterData).map(function (key) {
		// //   imageData.push(localRaterData[key]);
		// //  console.log(localRaterData[key])
		// });
	
		/* This fires after the view for the thumbnail is created and grabs the metadata from
		the DSA server */
		view.showProgress();
		ajax.getFolder("folder", constants.STUDY_FOLDER)
		  .then((d) => {
			// console.log(d)
			d.forEach((i) => {
			  i.meta.baseImageThumb =
				HOST_API + "/item/" + i.meta.mainImage._id + "/tiles/thumbnail";
			  i.meta.baseImageFile =
				HOST_API + "/item/" + i.meta.mainImage._id + "/tiles/dzi.dzi";
			  imageData.push(i.meta);
			});
			console.log(imageData);
	
			this._dataview.parse(imageData);
		  })
		  .finally(() => { view.hideProgress() });

		  this._toggleFilters.attachEvent("onItemClick", () => {
			this.toggleView();
		  });

		  this._filtersTree.attachEvent("onItemClick", (id) => {
			const tree = this._filtersTree;
			const item = tree.getItem(id);
			if (tree.isSelected(id)) {
				if (item.$count) {
					const childs = tree.find(obj => obj.$parent === item.id);
					childs.forEach(child => tree.unselect(child.id));
				}
				tree.unselect(id);
			}
			else {
				if (item.$parent && !tree.isSelected(item.$parent)) {
					tree.select(item.$parent, true);
				}
				tree.select(id, true);
			}
		});

		this._applyFiltersBtn.attachEvent("onItemClick", () => {
			this.filterData();
		});
	}

	toggleView() {
		const currentViewId = this._model.visibleViewId;
		const viewIds = ["thumbnailPanel", "thumbnailFilterPanel"];
		const id = viewIds.find(viewId => viewId !== currentViewId);
		this._multiview.setValue(id);
		this._model.visibleViewId = id;
		this._toggleFilters.define("icon", this._model.buttonIcon);
		this._toggleFilters.refresh();
	}

	filterData() {
		const filters = this._model.applyFilters();
		if (!filters.length) {
			this._dataview.filter();	
		}
		else {
			this._dataview.filter(item => filters.every(filter => item.featuresObservedForImage.find(feature => feature.includes(filter))));
		}
		this.toggleView();
		this.updateFilterTooltip();
	}

	updateFilterTooltip() {
		const filters = this._model.appliedFilters;
		let template = "Set filters";
		if (filters.length) {
			template = "<b>Applied filters:</b>"
			filters.forEach((filter) => {
				template += `<br>${filter}`;
			})
		}
		this._toggleFilters.define("tooltip", template);
	}
}