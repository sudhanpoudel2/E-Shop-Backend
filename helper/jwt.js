import { expressjwt } from "express-jwt";
//athentication api protection

function awthJwt() {
    const secret = process.env.secret;
    return expressjwt({
        secret,
        algorithms : ['HS512']
    }).unless({
        path:[
            {url : '/api/v1/product', methods: ['GET','OPTIONS']},
            "/api/v1/user/login",
            "/api/v1/user/register"
        ]
    })
}

export default awthJwt;