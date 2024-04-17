export default class APIService {

    static async GetAllItems() {
        const resp = await fetch(`/api/getAllItems`, {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await resp.json();
    }

    static async GetItemsByType(type) {
        const resp = await fetch(`/api/getItemsByType/${type}`, {
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });
        console.log(resp);
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
        console.log(resp);
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
        console.log(resp);
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
}