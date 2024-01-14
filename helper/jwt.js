import { expressjwt } from "express-jwt";

function awthJwt() {
    const secret = process.env.secret;
    return expressjwt({
        secret,
        algorithms : ['HS512']
    })
}

export default awthJwt;