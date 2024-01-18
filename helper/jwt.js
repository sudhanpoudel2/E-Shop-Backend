import {expressjwt} from "express-jwt";

// ...

function awthJwt() {
    const secret = process.env.secret;
    return expressjwt({
        secret,
        algorithms: ['HS512'],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: '/\/api\/v1\/product(.*)/', methods: ['GET', 'OPTIONS'] },
            { url: '/\/api\/v1\/category(.*)/', methods: ['GET', 'OPTIONS'] },
            "/api/v1/user/login",
            "/api/v1/user/register"
        ]
    });
}

// ...

async function isRevoked(req, payload, done){
    if(!payload.isAdmin){
        // Revoke access for non-admin users
        done(null, true);
    } else {
        // Grant access for admin users
        done();
    }
}

export default awthJwt;
