export default class APIService {

    static async GetItems({ type = 'all', search = '', page = 1,  sort = 'modified,desc', limit = 6, username = ''}) {
        const resp = await fetch(`/api/items?type=${type}&search=${search}&sort=${sort}&limit=${limit}&page=${page}&username=${username}`, {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await resp.json();
    }

    static async GetUserItems(username) {
        const resp = await fetch(`/api/getUserItems/${username}`, {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return await resp.json();
    }

    static async GetConfig() {
        const resp = await fetch(`/api/config`, {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await resp.json();
    }

    static async Login(email, password) {
        const resp = await fetch(`/auth/login`, {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password})
        });
        return await resp.json();
    }

    static async DeleteUser(username) {
        const resp = await fetch(`/auth/deleteUser/${username}`, {
            'method': 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return await resp.json();
    }

    static async VerifyToken(token) {
        const resp = await fetch(`/auth/verify-token`, {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        return await resp.json();
    }

    static async Register(name, email, password, cnfPassword) {
        const resp = await fetch(`/auth/register`, {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, email, password, cnfPassword})
        });
        return await resp.json();
    }

    static async SocialMediaLogin(name, accessToken, email, domain, pictureUrl) {
        const resp = await fetch(`/auth/social-media-login`, {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, accessToken, email, domain, pictureUrl})
        });
        return await resp.json();
    }

    static async UpdateUser(username, name, email, institution) {
        const resp = await fetch(`/auth/updateUser/${username}`, {
            'method': 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({name, email, institution})
        });
        return await resp.json();
    }

    
    static async UploadItem(formData) {
        const resp = await fetch(`/api/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });
        return await resp.json();
    }

    static async ValidateItemName(name) {
        const resp = await fetch(`/api/validateItemName/${name}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return await resp.json();
    }

    static async UpdateItem(id, formData) {
        const resp = await fetch(`/api/updateItem/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });
        // console.log(resp);
        return await resp.json();
    }

    static async DeleteItem(id) {
        const resp = await fetch(`/api/deleteItem/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return await resp.json();
    }

    static async GetUser() {
        const resp = await fetch(`/auth/getUser`, {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return await resp.json();
    }

    static SendImportToOpenSpaceCommand = async (url, type) => {
        var openspace = window.openspace;
        if (!openspace) {
            console.log("Connect to OpenSpace first!!");
            return;
        }
        var fileName = url.substr(url.lastIndexOf('/') + 1);
        url = window.location + url;
        switch (type) {
            case 'asset':
                var noextension = fileName.substr(0, fileName.indexOf('.'));
                var absPath = await openspace.absPath('${TEMPORARY}/' + fileName)
                var pathString = '${USER_ASSETS}/' + noextension + "/";
                var scenePath = await openspace.absPath(pathString)
                await openspace.downloadFile(url, absPath["1"], true);
                await openspace.unzipFile(absPath["1"], scenePath["1"], true);
                await openspace.asset.add(scenePath["1"] + noextension);
                await openspace.setPropertyValueSingle("Modules.CefWebGui.Reload", null)
                break;
            case 'profile':
                var absPath = await openspace.absPath('${USER_PROFILES}/' + fileName);
                await openspace.downloadFile(url, absPath["1"], true);
                break;
            case 'recording':
                var absPath = await openspace.absPath('${RECORDINGS}/' + fileName);
                await openspace.downloadFile(url, absPath["1"], true);
                break;
            default:
                console.log('nothing to do')
                break;
        }
    }
}