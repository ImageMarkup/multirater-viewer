import authService from "./authentication";
import constants from "../constants";

function parseError(xhr) {
    let message;
    switch (xhr.status) {
        case 404:
            {
                message = "Not found";
                webix.message({ type: "error", text: message });
                break;
            }
        default:
            {
                try {
                    let response = JSON.parse(xhr.response);
                    message = response.message;
                } catch (e) {
                    message = xhr.response;
                    console.log(`Not JSON response for request to ${xhr.responseURL}`);
                }
                webix.message({ text: message, expire: 5000 });
                break;
            }
    }
    return Promise.reject(xhr);
}

webix.attachEvent("onBeforeAjax", (mode, url, data, request, headers, files, promise) => {
    let toSearchInUrl = "cdn.webix.com";
    let searchedInUrl = url.search(toSearchInUrl);
    if (searchedInUrl === -1) {
        headers["Girder-Token"] = authService.getToken();
    }
});

class AjaxActions {
    getHostApiUrl() {

        //  return webix.storage.local.get("hostAPI"); // TO DO.. move this into constants //
        return 'http://dermannotator.org:8080/api/v1'
    }

    setTokenIntoUrl(token, symbol) {
        return token ? `${symbol}token=${token}` : "";
    }


    _ajax() {
        return webix.ajax();
    }

    _parseData(data) {
        return data ? data.json() : data;
    }

    _parseOsdTileSource(data, itemId) {
        console.log("Nothing ever works")
        data = data.json();
        console.log(data);

        //$$("slide_viewer").viewer.open({tileSource:"http://transplant.digitalslidearchive.emory.edu:8080/api/v1/item/5d530ee8c61d97adf7bc08b8/tiles/dzi.dzi?token=ZwWpnUUefBqlVP0tAhfL1eUYChuhQjYuIDBJt7eqmik0fRqyKeIpIwwW60vX3HkP", width: 39840})

        var girderToken = authService.getToken();
        var hostApiUrl = this.getHostApiUrl();
        var dziUrl = hostApiUrl + "/item/" + itemId + "/tiles/dzi.dzi?token=" + girderToken;
        console.log(dziUrl);
        var tileSource = { tileSource: dziUrl, width: data.sizeX, opacity: 0.1 }
        console.log(tileSource);

        return tileSource;
    }


    login(sourceParams) {
        const params = sourceParams ? {
            username: sourceParams.username || 0,
            password: sourceParams.password || 0
        } : {};
        const tok = `${params.username}:${params.password}`;
        let hash;
        try {
            hash = btoa(tok);
        } catch (e) {
            console.log("Invalid character in password or login");
        }
        return this._ajax()
            .headers({
                Authorization: `Basic ${hash}`
            })
            .get(`${this.getHostApiUrl()}/user/authentication`)
            .then(result => this._parseData(result));
    }

    logout() {
        return webix.ajax().del(`${this.getHostApiUrl()}/user/authentication`)
            .fail(parseError)
            .then(result => this._parseData(result));
    }

    getUserInfo() {
        return this._ajax().get(`${this.getHostApiUrl()}/user/me`)
            .fail(parseError)
            .then(result => this._parseData(result));
    }

    getCollection() {
        return this._ajax()
            .get(`${this.getHostApiUrl()}/collection`)
            .fail(parseError)
            .then(result => this._parseData(result));
    }

    getFolder(parentType, parentId) {
        return this._ajax()
            .get(`${this.getHostApiUrl()}/folder?parentType=${parentType}&parentId=${parentId}&limit=5000`)
            .fail(parseError)
            .then(result => this._parseData(result));
    }

    getItems(folderId) {
        const params = {
            limit: 0
        };
        return this._ajax()
            .get(`${this.getHostApiUrl()}/item?folderId=${folderId}?limit=5000`, params)
            .fail(parseError)
            .then(result => this._parseData(result));
    }

    getImage(imageId, height, width, imageType) {
        return webix.ajax().response("blob").get(`${this.getHostApiUrl()}/item/${imageId}/tiles/${imageType}`);
    }

    downloadItem(itemId) {
        return `${this.getHostApiUrl()}/item/${itemId}/download${this.setTokenIntoUrl(authService.getToken(), "?")}`;
    }

    getImageTiles(itemId) {
        return this._ajax()
            .get(`${this.getHostApiUrl()}/item/${itemId}/tiles`)
            .fail(parseError)
            .then(result => this._parseData(result));
    }

    getOsdTileSource(itemId) {
        return this._ajax()
            .get(`${this.getHostApiUrl()}/item/${itemId}/tiles`)
            .fail(parseError)
            .then(result => this._parseOsdTileSource(result, itemId))

    }

    getImageTileDziUrl(itemId) {
        return `${this.getHostApiUrl()}/item/${itemId}/tiles/dzi.dzi${this.setTokenIntoUrl(authService.getToken(), "?")}`;
    }

    getImageTileUrl(itemId, z, x, y) {
        return `${this.getHostApiUrl()}/item/${itemId}/tiles/zxy/${z}/${x}/${y}?edge=crop${this.setTokenIntoUrl(authService.getToken(), "&")}`;
    }

    getOpenFileUrl(itemId) {
        return `${this.getHostApiUrl()}/item/${itemId}/download?contentDisposition=inline${this.setTokenIntoUrl(authService.getToken(), "&")}`;
    }

    nSONFileData(itemId, sourceParams) {
        const params = sourceParams || {
            contentDisposition: "inline"
        };
        return this._ajax()
            .get(`${this.getHostApiUrl()}/item/${itemId}/download`, params)
            .fail(parseError)
            .then(result => this._parseData(result));
    }

    getLinearStucture(folderId, sourceParams) {
        const params = sourceParams ? {
            type: "folder",
            limit: sourceParams.limit || 5000,
            offset: sourceParams.offset || 0,
            sort: sourceParams.sort || "lowerName",
            sortdir: sourceParams.sortdir || 1
        } : {};
        return this._ajax()
            .get(`${this.getHostApiUrl()}/resource/${folderId}/items`, params)
            .fail(parseError)
            .then(result => this._parseData(result));
    }

    putNewFolderName(folderId, name) {
        const params = {
            name
        };
        return this._ajax()
            .put(`${this.getHostApiUrl()}/folder/${folderId}`, params)
            .fail(parseError)
            .then(result => this._parseData(result));
    }

    makeLargeImage(itemId) {
        return this._ajax()
            .post(`${this.getHostApiUrl()}/item/${itemId}/tiles`)
            .fail(parseError)
            .then(result => this._parseData(result));
    }

    updateItemMetadata(itemId, metadataObject) {
        const metadata = metadataObject ? {
            metadata: metadataObject
        } : {};
        return this._ajax()
            .put(`${this.getHostApiUrl()}/item/${itemId}/metadata`, metadata)
            .fail(parseError)
            .then(result => this._parseData(result));
    }

    putNewItemName(itemId, name) {
        const params = {
            name
        };
        return this._ajax()
            .put(`${this.getHostApiUrl()}/item/${itemId}`, params)
            .fail(parseError)
            .then(result => this._parseData(result));
    }

    updateFolderMetadata(folderId, metadata) {
        return this._ajax()
            .put(`${this.getHostApiUrl()}/folder/${folderId}/metadata`, metadata)
            .fail(parseError)
            .then(result => this._parseData(result));
    }

    recognizeOption(idsArray, option) {
        const ids = idsArray.join(",");
        return this._ajax()
            .get(`${constants.RECOGNIZE_SERVICE_PATH}/${option}?ids=${ids}`)
            .fail(parseError)
            .then(result => this._parseData(result));
    }

    // update when API fixes
    /* updateItemTag(itemId, itemTag) {
    	return this._ajax()
    		.put(`${this.getHostApiUrl()}/item/${itemId}/aperio?tag=${itemTag}`)
    		.fail(parseError)
    		.then(result => this._parseData(result));
    } */

    getItem(id) {
        return this._ajax()
            .get(`${this.getHostApiUrl()}/item/${id}`)
            .fail(parseError)
            .then(result => this._parseData(result));
    }
}

const instance = new AjaxActions();
export default instance;