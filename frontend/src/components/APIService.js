export default class APIService {

    static GetAllItems() {
        return fetch(process.env.REACT_APP_API_HOST + `/api/getAllItems`, {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(resp => resp.json())
    }


}