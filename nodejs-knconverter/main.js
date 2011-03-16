var http = require("http");
var url =  require("url");
var converter =  require("./converter.js");

http.createServer(
    function(req, res){
        // req.setEncoding("utf8");
        // req.content = '';
        var params = {};
        var full_url = url.parse( req.url, true ) ;
        var pathname = full_url.pathname ;
        var q_params = full_url.query ;
        var op = "";

        if (pathname.match(/\/ascii2unicode\/?/i)) {
            res.writeHead(200, {'Content-Type': 'application/json'});

            req.on('end', function(){
                       if (q_params['txt'] && q_params['map']) {

                           op = {"ok":true, "data": converter.ascii2unicode(q_params['map'], q_params['txt'])};
                           if (q_params['callback']) {
                               res.write(q_params['callback'] + '(' + JSON.stringify(op) + ')');
                           }
                           else {
                               res.write(JSON.stringify(op));
                           }

                           res.end();
                       }
                       else {
                           op = {"ok":false, "data":"No input data"};
                           if (q_params['callback']) {
                               res.write(q_params['callback'] + '(' + JSON.stringify(op) + ')');
                           }
                           else {
                               res.write(JSON.stringify(op));
                           }
                       }
                   });
        }
        else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write("Hello World!");
            res.end();
        }

    }).listen(8885);
