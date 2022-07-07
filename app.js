//Imorting Modules
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { url } = require("inspector");

//Creating App, Applying Body parser, Including static files
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//DIRECTING URLS
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const url = "https://us8.api.mailchimp.com/3.0/lists/39494f21c2";
  const jsonData = JSON.stringify(data);
  const options = {
    method: "POST",
    auth: "Shadab:fb01c44be5b51267ba863fd262030022-us8",
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      const Info = JSON.parse(data);
      if (Info.error_count === 0) {
        res.sendFile(__dirname + "/success.html");
      } else res.sendFile(__dirname + "/failure.html");
    });
  });

  request.write(jsonData);
  request.end();
});

app.get("/failure", function (req, res) {
  res.redirect("/");
});

app.get("/success", function (req, res) {
  res.redirect("/");
});

//INITIATING ONLINE SERVER THAT WORK ON HEROKU AND LOCALLY

app.listen(process.env.PORT || 3000, console.log("server is running"));

// Mailchimp API- fb01c44be5b51267ba863fd262030022-us8
// Mailchimp Audience ID- 39494f21c2
