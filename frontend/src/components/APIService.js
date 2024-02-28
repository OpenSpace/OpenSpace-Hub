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

    // router.post('/login', async (req, res) => {
    //     try {
    //         const {username, password} = req.body;
    //         const user = await User.findOne( {username} );
    //         if (!user) {
    //             return res.status(401).json({ error : 'Authentication failed' });
    //         }
    //         const passwordMatch = await bcrypt.compare(password, user.password);
    //         if (!passwordMatch) {
    //             return res.status(401).json( { error: 'Authentication failed'});
    //         }
    //         const token = jwt.sign( {userId : user._id }, process.env.SECRET_KEY, { expiresIn: '1h', });
    //         res.status(200).json({ token });
    //     } catch (error) {
    //         res.status(500).json({ error: 'Login failed' });
    //     }
    // });


}