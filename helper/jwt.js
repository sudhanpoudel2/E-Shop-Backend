import { expressjwt } from "express-jwt";
//athentication api protection

function awthJwt() {
    const secret = process.env.secret;
    return expressjwt({
        secret,
        algorithms : ['HS512'],
        isRevoked : isRevoked
    }).unless({
        path:[
            {url : '/\/api\/v1\/product(.*)/', methods: ['GET','OPTIONS']},
            {url : '/\/api\/v1\/category(.*)/', methods: ['GET','OPTIONS']},
            "/api/v1/user/login",
            "/api/v1/user/register"
        ]
    })
}

async function isRevoked(req, payload, done){
    if(!payload.isAdmin){
        done(null, true)
    }

    done();
}

export default awthJwt;