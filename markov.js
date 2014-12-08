var fs = require('fs'),
    _ = require('underscore'),
    async = require('async');

module.exports = {
    get: function (files, numWords, grams, callback) {
        getText(files, function (text) {
            var array = toArray(text);
            var map = {};
            for (var i = 0; i < array.length; i++) {
                var gram = "";
                for (var j = 0; j < grams; j++) {
                    gram += array[i + j] + " ";
                }
                gram = gram.trim();
                map[gram] = map[gram] ? map[gram] + 1 : 1;
            }

            var arr = expand(map);
            var tuple = getRandom(arr);
            var result = tuple + " ";

            for (var i = 0; i < numWords; i++) {
                var filtered = filter(arr, getLastWord(tuple));
                if (filtered && filtered.length > 1) {
                    tuple = getRandom(filtered);
                    result += stripFirstWord(tuple) + " ";
                }
                else {
                    tuple = getRandom(arr);
                    result += tuple + " ";
                }
            }

            callback(result);
        });
    }
};

function getText(files, callback) {
    //console.log("Getting text...");
    var buffers = [];
    async.map(files, fs.readFile, function (err, data) {
        for (var i = 0, l = data.length; i < l; i++) {
            buffers.push(new Buffer(data[i].toString()));
        }
        var allTexts = Buffer.concat(buffers).toString('utf8',0, 10000);
        //console.log("Getting text done!");
        callback(allTexts);
    });
}

function toArray(text) {
    console.log("toArray() start...");
    text = text.replace(/[`~@#$%^&*()_|+\-=;:"<>\{\}\[\]\\\/]/gi, ' ');
    text = text.replace(/(\r\n|\n|\r")/gm, " ");
    var array = text.split(" "), result = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i] != "") {
            result.push(array[i]);
        }
    }
    console.log("toArray() done!");
    return result;
}

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function expand(map) {
    var arr = [];
    for (var property in map) {
        if (map.hasOwnProperty(property)) {
            for (var i = 0; i < map[property]; i++) {
                arr.push(property);
            }
        }
    }
    return arr;
}

var startWordMap = {};

function filter(arr, word) {
    if (_.isEmpty(startWordMap)) {
        startWordMap = buildStartWordMap(arr);
    }

    return startWordMap[word];
}

function buildStartWordMap(arr) {
    //console.log("buildStartWordMap() started...");
    for (var i = 0; i < arr.length; i++) {
        var firstWord = getFirstWord(arr[i]);
        if (typeof startWordMap[firstWord] === 'undefined') {
            startWordMap[firstWord] = [];
        }
        startWordMap[firstWord].push(arr[i]);
    }
    //console.log("buildStartWordMap() done!", startWordMap);
    return startWordMap;
}

function getLastWord(str) {
    return str.split(" ").pop();
}

function stripFirstWord(str) {
    var stripped = str.substring(str.indexOf(" ") + 1, str.length);
    //console.log(str, stripped);
    return stripped;
}

function getFirstWord(str) {
    return str.split(" ")[0];
}