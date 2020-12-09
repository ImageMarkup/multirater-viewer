import {featureFilters} from "./featureFilterSet";

export default class ThumbnailPanelModel {
	constructor(filtersTree, viewId) {
		this.filtersTree = filtersTree;
		this.visibleViewId = viewId  || "thumbnailPanel";
		this.appliedFilters = [];
		this.collection = new webix.TreeCollection();
		this._parseFilters();
	}

	get buttonIcon() {
		return this.visibleViewId === "thumbnailPanel" ? "fas fa-sliders-h" : "fas fa-arrow-left"
	}

	get featureFilters() {
		return featureFilters;
	}

	_parseFilters() {
		let filters = Object.entries(featureFilters);
		filters = filters.map(([name, nestedNames]) => {
			return {
				name,
				data: nestedNames.map(val => ({name: val}))
			}
		});
		this.collection.parse(filters);
	}

	applyFilters() {
		const filters = this.collectAppliedFilters();
		this.appliedFilters = filters;
		return filters;
	}

	collectAppliedFilters() {
		const {ids, result} = this.filtersTree.getSelectedItem(true)
			.reduce((acc, obj) => {
				const {invalidIds, name} = this.getNestedFilterString(obj, "", []);
				acc.ids = acc.ids.concat(invalidIds).unique();
				acc.result.push(name);
				return acc;
			}, {ids:[], result: []});
		const filters = result.filter((name) => {
			return !ids.some((itemId) => {
				const item = this.filtersTree.getItem(itemId);
				return item.name === name.split(" : ").pop();
			});
		});

		return filters;
	}

	getNestedFilterString(item, resultStr, invalidIds) {
		const strTail = resultStr ? ` : ${resultStr}` : "";
		resultStr = `${item.name}${strTail}`;
		if (item.$parent) {
			invalidIds.push(item.$parent);
			const parent = this.filtersTree.getItem(item.$parent);
			return this.getNestedFilterString(parent, resultStr, invalidIds);
		}
		return {
			invalidIds,
			name: resultStr
		};
	}
}