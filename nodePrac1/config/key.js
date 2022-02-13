// process.env.NODE_ENV가 'production'이라고 뜨면,
if (process.env.NODE_ENV === "production") {
  module.exports = require("./prod"); //prod.js에서 가져옴
} else {
  module.exports = require("./dev"); //dev.js에서 가져옴
}
