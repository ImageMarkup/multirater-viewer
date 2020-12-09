import {JetView, plugins} from "webix-jet";
import constants from "../constants";

export default class TopView extends JetView{
	config(){

		const headerToolbar = {
			view: "toolbar",
			padding: 3,
			elements: [
				{
					view: "icon",
					icon: "fas fa-bars",
					click: () => {
						this.sidebar.toggle();
					}
				},
				{
					view: "label",
					label: "Multirater"
				},
				{}
			]
		};

		const sidebar = {
			view: "sidebar",
			localId: "sidebar",
			collapsed: true,
			data: constants.SIDEBAR_MENU_CONFIG
		};

		const ui = {
			margin:5,
			css:"app_layout",
			rows: [
				headerToolbar,
				{
					margin:5,
					cols: [
						sidebar,
						{$subview: true}
					]
				}
			]
		};

		return ui;
	}
	init(){
		this.use(plugins.Menu, "sidebar");
	}

	get sidebar() {
		return this.$$("sidebar");
	}
}