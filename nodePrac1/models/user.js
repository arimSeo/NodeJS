const mongoose = require("mongoose"); //mongoose 모듈 가져오기

//mongoose를 이용해 스키마 생성
const userSchema = mongoose.Schema({
  //필드 작성
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
      type: String,
      trim:true,    //입력한 이메일에 띄어쓰기가 있을경우 없애줌
      unique:1      //이메일 중복x
  },
  password: {
      type:String,
      minlength: 6
  },
  lastname:{
      type:String,
      maxlength: 50
  },
  role: {
      type: Number,
      default: 0    //0이면 사용자, 1이면 관리자
  },
  image: String,
  //토큰으로 유효성 관리
  token:{
      type:String
  },
  //토큰 유효기간
  tokenExp:{
      type:Number
  }
});

//
const bcrypt = require('bcrypt');  //bycrypt 모듈 불러오기
const saltRounds=10 

//유저 모델을 저장(.save)하기 전에 function{ } 을 실행 
//next : 파라미터 
userSchema.pre('save', function( next ){
    var user=this;  //위에 스키마 값들을 가리킴

    if(user.isModified('password')){   //다른 데이터들 변경시에 비밀번호가 같이 계속 새로 암호화되지 않도록
        // 비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err,hash){
                if(err) return next(err)
                user.password=hash  //hash(암호화된)비밀번호로 기존거를 변경
                next()  //함수 실행 -> index.js에 .save부분 실행
            })
        })
    }
    //다른 user 정보 수정했을때
    else{
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword :입력한 비밀번호
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
            cb(null, isMatch)   //일치한다면, callback error가 null이고 isMatch엔 true가 됨
    })
}

//token만들기
const jwt = require('jsonwebtoken');  //jsonwebtoken가져오기 (=import)

userSchema.methods.generateToken = function(cb){
    var user =this  //ES5 문법
    //jsonwebtoken을 이용해 token 생성
    var token= jwt.sign(user._id.toHexString(), 'secretToken')  
    //token= user._id + 'secretToken' 
    //'secretToken'으로 user._id를 알 수 있음
    
    user.token =token
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null, user)  //err없을때 user정보 반환
    })
}


//스키마를 모델로 감싸주기 .model('모델명',스키마이름)
const User = mongoose.model('User',userSchema)
//User모델을 외부에서 쓸 수 있도록 export 하기 
module.exports={ User }