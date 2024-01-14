import { expressjwt } from "express-jwt";
//athentication api protection

function awthJwt() {
    const secret = process.env.secret;
    return expressjwt({
        secret,
        algorithms : ['HS512']
    })
}

export default awthJwt;