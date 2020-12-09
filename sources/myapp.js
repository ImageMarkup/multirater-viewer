import {JetApp, EmptyRouter, HashRouter } from "webix-jet";
import "regenerator-runtime/runtime"
import "./styles/app.css";
import "./utils/pollyfils";
import state from "./models/state";

export default class MyApp extends JetApp{
	constructor(config){
		const defaults = {
			id 		: APPNAME,
			version : VERSION,
			router 	: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug 	: !PRODUCTION,
			start 	: "/top/multirater"
		};

		super({ ...defaults, ...config });
	}
}

if (!BUILD_AS_MODULE){
	webix.ready(() => {
		const app = new MyApp();
		app.render();
		state.app = app;
	});
}

