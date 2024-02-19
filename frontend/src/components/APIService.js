export default class APIService {

    static GetAllItems() {
        return fetch(`http://localhost:9000/api/getAllItems`, {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(resp => resp.json())
    }


}