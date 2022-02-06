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

//스키마를 모델로 감싸주기 .model('모델명',스키마이름)
const User = mongoose.model('User',userSchema)
//User모델을 외부에서 쓸 수 있도록 export 하기 
module.exports={ User }