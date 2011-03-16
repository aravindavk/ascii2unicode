var mapDict = {};

function wordConvert(inputWord){
    var i = 0;
    var count = inputWord.length;
    var unicodeWord = "";
    while (i < count) {
        for (var j=5; j>0; j--) {
            var key = inputWord.substring(i, (i+j));
            if (mapDict[key]) {
                unicodeWord += mapDict[key];
                i += j;
                break;
            }
            else if( j == 1) {
                unicodeWord += inputWord[i];
                i++;
                break;
            }
        }
    }
    return unicodeWord;
}


function convert(mapName, inputTxt){
    try {
        mapDict = require("./maps/" + mapName).charmap;
    } 
    catch (x) {
        mapDict = {};
    }

    var unicodeTxt = "";
    var words = inputTxt.split(' ');
    var count = words.length;

    words.forEach(function(word){
                      unicodeTxt += (wordConvert(word) + " ");
                  });

    return unicodeTxt.replace(/\s*$/, '');
}

exports.ascii2unicode = convert;
