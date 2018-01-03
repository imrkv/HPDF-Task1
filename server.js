var express = require('express');
var morgan = require('morgan');
var request = require('request');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();    //Express middleware for handling requests

var port = 8080;        //starting server on localhost:8080
app.listen(port, function () {
  console.log(`HPDF task-1 server listening on port ${port}!`);
});

app.use(morgan('short'));   //logging request/response in console

app.use(session({           //setting up session to save cookie / get cookie
    secret:"wow!it's a secret bro",
    cookie: {maxAge : 1000 * 60 * 60 * 24 * 30 },   //set to 1-month: 1000(ms)*60(sec)*60(min)*24(hours)*30(days)
	proxy: true,
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.json()); //parse JSON request body

//Requset on Home page
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

//Requset of Necessary files like style.css, main.js etc.
app.get('/ui/:fileName', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', req.params.fileName));
});

//Request of List of Author and Count of Published article to be displayed
app.get('/authors', function (req, res) {
    var authorList=[];
    var articleList=[];
	
	var authorPromise = new Promise(function(resolve,reject){
		request('https://jsonplaceholder.typicode.com/users', function (error, response, body) {
        if(error)
            reject(Error("Not Found"));
		else
			authorList=JSON.parse(body);
			resolve("Fetched authorList");
		});
	});
	
	var articlePromise = new Promise(function(resolve,reject){
		request('https://jsonplaceholder.typicode.com/posts', function (error, response, body) {
        if(error)
            reject(Error("Not Found"));
		else
			articleList=JSON.parse(body);
			resolve("Fetched articleList");
		});
	});
	
	Promise.all([authorPromise,articlePromise]).then(function(Result) {
		res.send(displayList(authorList,articleList));
	}).catch(function(err){
		throw err;
	});
	
});

function displayList(authorList,articleList){
  var data="";
  for (i in authorList){
        var tempArr=articleList.filter(List=>authorList[i].id===List.userId);
        data+=`<tr><td>${authorList[i].name}</td><td>${tempArr.length}</td></tr>`;
  }
  
  var htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <title> Author and Articles
            
        </title>
        <meta name="viewpart" content="width=device-width initial-scale=1" />
     <link href="/ui/style.css" rel="stylesheet" />
      </head>
      <body>
        <table>
            <tr>
                <th> Author Name </th>
                <th> Article Count </th>
            </tr>
            ${data}
        </table>   
     </body>
    </html>
  `;
  return htmlTemplate;
}

//Request of Set Cookie 
app.get('/setcookie', function (req, res) {
  if(req.session.username && req.session.age)
    res.send("you already set a cookie");
  else{
        req.session.username="Ronak Vithlani";
        req.session.age=28;
        res.send("cookie setup complete");
    } 
});

//Request of Get Cookie
app.get('/getcookies', function (req, res) {
  if(req.session.username && req.session.age)
    res.send("username: "+req.session.username+", age: "+req.session.age);
  else{
        res.send("Please set the cookie first");
    } 
});

//Request for robot.txt which reply with forbidden request
app.get('/robots.txt', function (req, res) {
  res.redirect('http://httpbin.org/deny');
  //res.status(403).send("unauthorized access")    //alternative way
});

//Request for render HTML page
app.get('/html', function (req, res) {
  res.sendFile(path.join(__dirname, 'others', 'test.html'));
});

//Request to render image
app.get('/image', function (req, res) {
  res.sendFile(path.join(__dirname, 'others', 'image.jpg'));
});

//Request to create input box and display on webpage(endpoint)
app.get('/input',function(req,res){
    res.sendFile(path.join(__dirname, 'ui', 'input.html'));
});

app.post('/submit', function (req, res) {
    console.log(req.body.msg);
    res.send("OK");
    
});


