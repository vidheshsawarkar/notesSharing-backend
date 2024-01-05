const jwt = require('jsonwebtoken');
function userMiddleware(req, res, next) {
    try{
        const value = req.headers.authorization;
        const auth = value.replace("Bearer ", "");
        const verify = jwt.verify(auth, "123456");
        req.username = verify.username;
        next();
    }
    catch{
        return res.status(400).json({
            msg: "User not found"
        })
    }
}

module.exports = userMiddleware;