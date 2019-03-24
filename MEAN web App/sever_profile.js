var fs = require('fs');
var http = require('http');
var path = require('path');
var url = require('url');
var qs = require('querystring');

const MONGO_URL = "mongodb://localhost/mean";
const MONGO_USERNAME = "matchMaker";
const MONGO_PASSWORD = "p@ssw0rd";

const mongoose = require('mongoose');
mongoose.connect(MONGO_URL, {
    auth: {
        user: MONGO_USERNAME,
        password: MONGO_PASSWORD
    },
    useNewUrlParser: true
});
mongoose.set('useCreateIndex', true);
const meanSchema = require('./mean_schema.js').meanSchema;
const User = mongoose.model('User', meanSchema);

mongoose.connection.once('open', function () {
    console.log("Open connection!");
});

const bcrypt = require('bcrypt');

http.createServer(function (req, res) {

    var urlObj = url.parse(req.url, true, false);
    console.log(urlObj.pathname);

    if (req.method == "GET") {
        console.log(req.url);
        var extensionName = path.extname(req.url);
        console.log(extensionName);
        var destinationPath;
        switch (extensionName) {
            case '.html':
                destinationPath = './html' + req.url;
                break;
            case '.css':
                destinationPath = './css' + req.url;
                break;
            case '.js':
                destinationPath = './js' + req.url;
                break;
            case '.jpg':
            case '.png':
                destinationPath = './images' + req.url;
                break;
            default:
                destinationPath = req.url;
        }
        console.log(destinationPath);
        var mimeType = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif'

        };
        var contentType = mimeType[extensionName] || 'application/octet-stream';
        /*if (urlObj.pathname.slice(urlObj.pathname.indexOf(".") + 1) == "html") {
            fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
                sendFile(err, data, res);
            });
        } else {
            fs.readFile(urlObj.pathname.slice(1), function (err,data) {
                sendFile(err, data, res);
            });
        }*/
        fs.readFile(destinationPath, function (err, data) {
            /*
            If error reading (or finding) the file
             */
            if (err) {
                /*404 CASE*/
                console.log("Inside 404");
                if (err.code == 'ENOENT') {
                    fs.readFile('./html/pageUnderConstruction.html', function (error, datas) {
                        res.writeHead(200, {'Content-type': 'text/html'});
                        res.end(datas);
                    });
                }
                /* else {
                     res.writeHead(404);
                     res.end(JSON.stringify(err));
                     return;
                 }*/
            }
            /*
            Return the contents of the file
             */
            //console.log("Extension name and content Type below");
            console.log(extensionName);
            // console.log(contentType);
            res.writeHead(200, {'Content-Type': contentType});//contentType gets last one like js/html
            res.end(data);
        });


    } else if (req.method == "POST") {
        console.log("POST!");
        console.log(urlObj.pathname);
        var body = '';

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) {
                req.connection.destroy();
                mongoose.disconnect();
            }
        });
        if (urlObj.pathname === "/register.html") {
            req.on('end', function () {
                var post = qs.parse(body);
                console.log(post.username);
                console.log(post.password);

                //Username Validation - not empty
                if (!post.username || post.username.length <= 0) {
                    res.writeHead(404);
                    res.end("Username is required!");
                    return;
                }
                //Username Validation- email format
                var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if (!post.username.match(mailformat)) {
                    res.writeHead(404);
                    res.end("Username isnt in Email Format!");
                    return;
                }
                //Password Validation - not empty
                if (!post.password || post.password.length <= 0) {
                    res.writeHead(404);
                    res.end("Password is required!");
                    return;
                }

                bcrypt.hash(post.password, 10, function (err, hash) {
                    console.log(post.password + " is hashed to: " + hash);

                    var newUser = new User({
                        userName: post.username,
                        password: hash
                    });

                    newUser.save({}, function (err, doc) {
                        if (err) {
                            console.log(err);
                            res.writeHead(412);
                            res.end("Registration not successful, Username Already exsists!");
                            // res.end(JSON.stringify(err));
                        } else {
                            console.log("\nSaved document: " + doc);
                            res.writeHead(200);
                            res.end("Registration Success!");
                            // res.end(JSON.stringify(doc));
                            //console.log("Done writing!");
                        }
                        // mongoose.disconnect();
                    });
                });
            });
        }
        if (urlObj.pathname === "/login.html") {
            console.log("Login!");
            req.on('end', function () {
                var post = qs.parse(body);
                console.log(post.username);
                console.log(post.password);

                //Username Validation - not empty
                if (!post.username || post.username.length <= 0) {
                    res.writeHead(404);
                    res.end("Username is required!");
                    return;
                }
                //Username Validation- email format
                var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if (!post.username.match(mailformat)) {
                    res.writeHead(404);
                    res.end("Username isnt in Email Format!");
                    return;
                }
                //Password Validation - not empty
                if (!post.password || post.password.length <= 0) {
                    res.writeHead(404);
                    res.end("Password is required!");
                    return;
                }
                //Find user and compare passwords
                User.findOne({userName:post.username},function(err,doc)
                {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    if(doc)
                    {
                        bcrypt.compare(post.password,doc.password,function(err, result){
                            // bcrypt.compare("123",doc.password,function(err, res){
                            if(result)
                            {
                                console.log("Passwords match");
                                /*doc.firstName = "Amrita";
                                doc.lastName = "tk";
                                doc.interests = "dancing";
                                doc.state    = "MO";

                                doc.save();
                                console.log("Profile Updated!");
                                res.writeHead(200);
                                res.end("Profile Updated!");*/

                                res.writeHead(200);
                                res.end("Login Success!");
                            }
                            else {
                                console.log("Passwords don't match");
                                res.writeHead(412);
                                res.end("Incorrect Password");
                            }
                        });
                    }
                    else {console.log("username itsnt exsisting!");
                        res.writeHead(412);
                        res.end("Username Incorrect!");
                    }
                });

            });
            console.log("inside /out/ of login.html");
        }
        if(urlObj.pathname === "/personalProfile.html")
        {
            req.on('end', function () {
                var post = qs.parse(body);
                console.log("Profile reached!");
                console.log(post.firstName);
                console.log(post.lastName);
                console.log(post.interest);
                console.log(post.state);
                //console.log(post.profileImage.url);
                console.log(post.ImageUpload);
                //console.log(post.ImageUpload.url);

                /*res.writeHead(200);
                res.end("Profile Reached!");*/

                //All validation (none here)
               // User.findOne({userName:post.username},function(err,doc)
                User.findOne({userName:"ui@gmail.com"},function(err,doc)
                {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    if(doc)
                    {
                        doc.firstName = post.firstName;
                        doc.lastName = post.lastName;
                        doc.interests = post.interest;
                        doc.profileImage = post.ImageUpload;
                        doc.state    = post.state;

                        doc.save();
                        console.log("Profile Updated!");
                        res.writeHead(200);
                        res.end("Profile Updated!");

                    }
                    else {console.log("itsnt exsisting!");
                        res.writeHead(412);
                        res.end("Username Incorrect!");
                    }
                });


            });
        }

    }
}).listen(8080);

