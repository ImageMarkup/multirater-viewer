import authService from "services/authentication";
import ajax from "services/ajaxActions";

class HeaderService {
	constructor(view, loginPanel, logoutPanel) {
		this._view = view;
		this._loginPanel = loginPanel;
		this._logoutPanel = logoutPanel;
		this._init();
	}

	_init() {
		// child views
		this._hostBox = this._view.$scope.getHostBox();
		this._collectionBox = this._view.$scope.getCollectionBox();
		this._mainLogo = this._view.$scope.getMainLogo();

		this._setValueAndParseData();

		this._view.$scope.on(this._view.$scope.app, "login", () => {
			this.showLogoutPanel();
		});

		this._view.$scope.on(this._view.$scope.app, "logout", () => {
			this._loginPanel.show();
		});

		if (authService.isLoggedIn()) {
			this.showLogoutPanel();
			ajax.getUserInfo();
		}


		// setting onChange event for hosts
		this._hostBox.attachEvent("onChange", (newId, oldId) => {
			if (newId !== oldId) {
				webix.confirm({
					title: "Attention!",
					type: "confirm-warning",
					text: "Are you sure you want to change host? All data will be cleared.",
					cancel: "Yes",
					ok: "No",
					callback: (result) => {
						if (!result) {
							this._putValuesAfterHostChange(newId);
							this._view.$scope.app.refresh();
						}
						else {
							this._hostBox.blockEvent();
							this._hostBox.setValue(oldId);
							this._hostBox.unblockEvent();
						}
					}
				});
			}
		});

		this._collectionBox.attachEvent("onChange", (id) => {
			const collectionItem = this._collectionBox.getList().getItem(id);
			this._view.$scope.app.callEvent("onCollectionChange", [id, collectionItem]);
		});

		// select menu item by current view
		this._view.$scope.on(this._view.$scope.app, "app:route", (url) => {
			const header = this._view;
			const segment = url[header.$scope.getIndex()];
			if (segment) {
				switch (segment.page) {
					case "main":
						const firstId = this._collectionBox.getList().getFirstId();
						const collectionId = this._collectionBox.getValue() || firstId;
						this._collectionBox.callEvent("onChange", [collectionId]);
						break;
					default:
						break;
				}
			}
		});
	}

	showLogoutPanel() {
		this._logoutPanel.show(false, false);
	}

	// setting hosts value and parsing data to collection and tree
	_setValueAndParseData() {
		const localStorageHostId = webix.storage.local.get("hostId");
		const firstHostItemId = process.env.SERVER_LIST[0].id;
		const hostId = localStorageHostId || firstHostItemId;
		this._putValuesAfterHostChange(hostId);
		this._hostBox.setValue(hostId);
		this._view.$scope.parseCollectionData();
	}

	_putValuesAfterHostChange(hostId) {
		const hostBoxItem = this._hostBox.getList().getItem(hostId);
		const hostAPI = hostBoxItem.hostAPI;
		webix.storage.local.put("hostId", hostId);
		webix.storage.local.put("hostAPI", hostAPI);
	}
}

export default HeaderService;
