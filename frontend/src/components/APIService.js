export default class APIService {

    static async GetAllItems() {
        const resp = await fetch(process.env.REACT_APP_API_HOST + `/api/getAllItems`, {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await resp.json();
    }

    static async Login(username, password) {
        const resp = await fetch(process.env.REACT_APP_API_HOST + `/auth/login`, {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        });
        console.log(resp);
        return await resp.json();
    }

    static async Register(username, password, cnfPassword) {
        const resp = await fetch(process.env.REACT_APP_API_HOST + `/auth/register`, {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password, cnfPassword})
        });
        console.log(resp);
        return await resp.json();
    }

    static async UploadItem(formData) {
        const resp = await fetch(process.env.REACT_APP_API_HOST + `/api/upload`, {
            method: 'POST',
            body: formData
        });
        if (resp.ok) {
            return await resp.json();
        }
        throw new Error('Error uploading file');
    }
}