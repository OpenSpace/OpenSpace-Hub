import { auth } from '../firebase';

export default class APIService {
  static async GetItems({
    type = 'all',
    search = '',
    page = 1,
    sort = 'modified,desc',
    limit = 6,
    username = ''
  }) {
    const resp = await fetch(
      `/api/items?type=${type}&search=${search}&sort=${sort}&limit=${limit}&page=${page}&username=${username}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return await resp.json();
  }

  static async GetUserItems(username) {
    const resp = await fetch(`/api/getUserItems/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.currentUser.accessToken}`
      }
    });
    return await resp.json();
  }

  static async GetConfig() {
    const resp = await fetch('/api/config', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await resp.json();
  }

  static async DeleteUser(username) {
    const resp = await fetch(`/auth/deleteUser/${username}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.currentUser.accessToken}`
      }
    });
    return await resp.json();
  }

  static async VerifyToken(token) {
    const resp = await fetch('/auth/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.currentUser.accessToken}`
      }
    });
    return await resp.json();
  }

  static async SocialMediaLogin() {
    const resp = await fetch('/auth/social-media-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.currentUser.accessToken}`
      }
    });
    return await resp.json();
  }

  static async UpdateUser(username, name, email, institution) {
    const resp = await fetch(`/auth/updateUser/${username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.currentUser.accessToken}`
      },
      body: JSON.stringify({ name, email, institution })
    });
    return await resp.json();
  }

  static async UploadItem(formData) {
    const resp = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.currentUser.accessToken}`
      },
      body: formData
    });
    return await resp.json();
  }

  static async ValidateItemName(name) {
    const resp = await fetch(`/api/validateItemName/${name}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${auth.currentUser.accessToken}`
      }
    });
    return await resp.json();
  }

  static async UpdateItem(id, formData) {
    const resp = await fetch(`/api/updateItem/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth.currentUser.accessToken}`
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
        Authorization: `Bearer ${auth.currentUser.accessToken}`
      }
    });
    return await resp.json();
  }

  static async GetUser() {
    const resp = await fetch(`/auth/getUser`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.currentUser.accessToken}`
      }
    });
    return await resp.json();
  }

  static SendImportToOpenSpaceCommand = async (url, type) => {
    const openspace = window.openspace;
    if (!openspace) {
      console.log('Connect to OpenSpace first');
      return;
    }
    const fileName = url.substr(url.lastIndexOf('/') + 1);
    url = window.location + url;
    switch (type) {
      case 'asset':
        const noextension = fileName.substr(0, fileName.indexOf('.'));
        const absPath = await openspace.absPath('${TEMPORARY}/' + fileName);
        const pathString = '${USER_ASSETS}/' + noextension + '/';
        const scenePath = await openspace.absPath(pathString);
        await openspace.downloadFile(url, absPath, true);
        await openspace.unzipFile(absPath, scenePath, true);
        await openspace.asset.add(scenePath + noextension);
        await openspace.setPropertyValueSingle('Modules.CefWebGui.Reload', null); // TODO: probably unecessary now
        break;
      case 'profile': {
        const absPath = await openspace.absPath('${USER_PROFILES}/' + fileName);
        await openspace.downloadFile(url, absPath, true);
        break;
      }
      case 'recording': {
        const absPath = await openspace.absPath('${RECORDINGS}/' + fileName);
        await openspace.downloadFile(url, absPath, true);
        break;
      }
      default:
        console.error('Unhandled import type', type);
        break;
    }
  };
}
