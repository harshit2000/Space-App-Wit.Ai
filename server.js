//importing dependencies
const express = require("express");
const fileUpload = require("express-fileupload");
const multer = require("multer");
const axios = require("axios");
let spaceApp = {};

//start express app
const app = express();

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html

//app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});

app.use(fileUpload({}));

const upload = multer({
  limits: {
    // 2 MB upload limit.  Should just fall under wit's 20-second limit
    fileSize: 2 * 1024 * 1024,
    files: 1 // 1 file
  }
});


app.post("/upload", upload.single("myfile"), (req, res, next) => {
  //extract the file from the request
  let upFile = req.files.myfile;
  console.log("file uploaded:");
  console.log(upFile);
  var buffer = upFile.data;

  const url = "https://api.wit.ai/speech";
  const witToken = "ERYNLABLDMFDGWMXBBOSWTCAI4LWT3ZF"; //don't put your token inline

  axios
    .post(url, buffer, {
      headers: {
        Authorization: "Bearer " + witToken,
        "Content-Type": "audio/wav"
      }
    })

    .then(witResponse => {
      console.log("wit response: " + JSON.stringify(witResponse.data));
      res.json(witResponse.data);
      spaceApp = witResponse.data;
    })

    .catch(e => {
      console.log("error sending to wit: " + e);
      res.json({ error: e.message });
    });
});


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

console.log(spaceApp);
