//백엔드 시작페이지
const express = require("express"); //express설치해서 사용가능
const app = express(); //app에 사용할 express함수 불러오기
const port = 3000;
const bodyParser =require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');   //config폴더 내 key.js파일 찾아가기 변수선언

const { User } =require("./models/User");

//application/x-www-form-urlencoded 형태로 된 데이터를 분석해서 가져오기 위해
app.use(bodyParser.urlencoded({extended:true}));
//json타입으로 된 데이터를 분석해서 가져오기 위해
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

//get 메소드
app.get("/", (req, res) => {
  res.send("Hello World! nodemon추가해서 자동변경 업데이트 되지롱");
});

//회원가입을 위한 register route 만들기
//post 메소드
app.post('/register',(req,res)=>{  //end point: '/register' , callback function: (req,res)
  //회원가입시 필요한 정보들을 client에서 가져오면 -> DB에 넣어주기!
  
  const user =new User(req.body)  //body-parser가 이용되어 client에서 보낸 정보를 받아줌(request)

  //save하기 전에 비밀번호 암호화! 
  user.save((err,userInfo)=>{
    if(err) return res.json({sucess: false, err})
    return res.status(200).json({
      sucess:true
    })
  })
})

//로그인을 위한 login route
app.post('/login',(req,res)=>{
    // 1.요청된 이메일을 DB에 있는지 찾기
    User.findOne({ email: req.body.email }, (err,user)=>{
      if(!user) {
        return res.json({
          loginSucess: false,
          message: "제공된 이메일에 해당하는 유저가 없습니다."
        })
      }

      // 2.요청된 이메일이 DB에 있다면, 비밀번호가 맞는지 확인
        //comparePassword : 메소드
      user.comparePassword(req.body.password, (err,isMatch) =>{
          //req.body.password = plainPassword(user.js) 
          if(!isMatch)
            return res.json({ loginSucess:false, message:"비밀번호가 틀렸습니다." })


       // 3.비밀번호가 맞다면 토큰을 생성(user.js에서 만든걸 불러옴)
          user.generateToken((err, user) =>{
            if(err) return res.status(400).send(err);

            //token저장하기 - 쿠키 or 로컬스토리지
            res.cookie("x_auth",user.token) //사이트에서 cookie확인시 x_auth이름 + 쿠키(토큰이 입력되어있음)
            .status(200)
            .json({ loginSucess:true, userId: user._id })
          })
      })
    })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
