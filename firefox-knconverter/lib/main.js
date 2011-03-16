// Import the APIs we need.
var contextMenu = require("context-menu");
var request = require("request");
var selection = require("selection");
var converter = require("converter");

exports.main = function(options, callbacks) {
    console.log(options.loadReason);

    // Create a new context menu item.
    var menuItem = contextMenu.Menu(
        {
            label: "Convert to Unicode",
            context: contextMenu.SelectionContext(),
            items:[
                contextMenu.Item({label: "Baraha", data: "baraha"}),
                contextMenu.Item({label: "Kannada Prabha", data: "kannadaprabha"})
            ],
            contentScript: 'on("click", function (obj, data) {' +
                '  var text = window.getSelection().toString();' +
                '  postMessage({"text":text, "mapName": data});' +
                '});',
            onMessage: function (details) {
                if (details.text && details.text.length == 0) {
                    throw ("Text to translate must not be empty");
                }
                var data = converter.ascii2unicode(details.mapName, details.text);
                selection.text = data;
            }                                     
        });
};

exports.onUnload = function (reason) {
    console.log(reason);
};