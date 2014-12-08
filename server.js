var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
	path = require('path'),
	fs = require('fs'),
	markov = require('./markov'),
    port = parseInt(process.env.PORT, 10) || 4567;

app.get("/", function (req, res) {
    var dir = path.dirname(require.main.filename) + "/texts";

    fs.readdir(dir, function(err, files) {
	    if (err) {
            return res.end(err);
        }

        for (var i = 0; i < files.length; i++) {
            files[i] = dir + path.sep + files[i];
        }
        markov.get(files, 500, 7, function(text) {
            res.header('Content-Type', 'text/plain');
            res.end(text);
        });
  });
});


app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));

console.log("Simple static server listening at http://localhost:" + port);
app.listen(port);
