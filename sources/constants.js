const TOP_PATH = "/app";

export default {

	KEY_TOKEN: "girderToken",
	APP_PATHS: {
		MAIN: `${TOP_PATH}/main`,
		TAGGER: `${TOP_PATH}/tagger`
	},

	SIDEBAR_MENU_CONFIG: [
		{id: "multirater", icon: "fas fa-table", value: "Multirater"},
		{id: "data", icon: "fas fa-list", value:"Data"},
	],

	PATTERN_PASSWORD: "^[!@_#$%^&?*()\"\\0-9a-zA-Z]{6,15}$",
	PATTERN_PASSWORD_HAS_SPEC_SYMBOLS: "[!@_#$%^&?*()\"\\0-9]+",
	PATTERN_LOGIN: "^[a-zA-Z]{1}[a-zA-Z0-9_.]{3,}$",

	RENAME_CONTEXT_MENU_ID: "Rename folder",
	LINEAR_CONTEXT_MENU_ID: "Make linear structure",
	RENAME_FILE_CONTEXT_MENU_ID: "Rename file",
	REFRESH_FOLDER_CONTEXT_MENU_ID: "Refresh folder",

	MOUSE_LEFT_SINGLE_CLICK: "mouseLeftSingle",
	MOUSE_RIGHT_SINGLE_CLICK: "mouseRightSingle",
	MOUSE_LEFT_DOUBLE_CLICK: "mouseLeftDouble",

	HOST_API_URL : "http://dermannotator.org:8080/api/v1",
	STUDY_FOLDER: "5fac5180887370bb7c8b8a11",
	COLOR_PALLETE : [
		"#1f77b4",
		"#ff7f0e",
		"#2ca02c",
		"#d62728",
		"#9467bd",
		"#8c564b",
		"#e377c2",
		"#7f7f7f",
		"#bcbd22",
		"#17becf"
	  ],
	 HOST_API :"http://dermannotator.org:8080/api/v1"
};

//STUDY_FOLDER: "5d02992b704d454c50973beb" //" //New Data Set Folder ### THIS ONE STILL SEEMS TO WORK.. SO WHAT DID I BREAK!!
	// STUDY_FOLDER : "5d02992b704d454c50973beb"