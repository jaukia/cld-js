var cld = require("./cld-min.js");

var text = "Tämä teksti on todellakin suomea."
var lang = cld.detectLanguage(text);

console.log("Input text: "+text);
console.log("Detected language: "+lang);