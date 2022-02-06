//백엔드 시작페이지
const express = require("express"); //express설치해서 사용가능
const app = express(); //app에 사용할 express함수 불러오기
const port = 3000;

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://arimSeo:<password>@cluster0.im4ee.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    // {
    //   useNewUrlParser: true,
    //   useUnindifiedTopology: true,
    //   useCreateIndex: true,
    //   unFindAndModify: false,
    // }
  )
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
