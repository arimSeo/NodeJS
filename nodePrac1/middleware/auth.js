const { User } = require("../models/User");

//토큰 인증처리 하는 곳
let auth=(req,res,next) =>{
    //1. client cookie에서 토큰을 가져온다
    let token = req.cookies.x_auth;

    //2. 토큰을 복호화 한 후 유저를 찾는다
    //user모델(user.js)에서 만든 findByToken 사용
    User.findByToken(token, (err,user)=> {
        if(err) throw err;
        if (!user) return res.json({isAuth: false, error: true})

        //3. 유저가 있으면 인증 ok, 없으면 NO
        req.token = token;
        req.user = user;
        next();  //index.js에서 auth가 다음으로 넘어갈 수 있게! (middleware에 갖혀버림 방지)
    }) 
}

module.exports = {auth}