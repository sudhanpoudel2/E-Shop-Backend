import expressJwt from "express-jwt";

function awthJwt() {
  const secret = process.env.SECRET;

  return expressJwt({
    secret,
    algorithms: ["HS512"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/api\/v1\/product(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/category(.*)/, methods: ["GET", "OPTIONS"] },
      "/api/v1/user/login",
      "/api/v1/user/register",
    ],
  });
}

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  } else {
    done();
  }
}

export default awthJwt;
