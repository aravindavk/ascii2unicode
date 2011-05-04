// ASCII to Unicode Encoding Converter

// Copyright (C) 2011 by Aravinda VK.<hallimanearavind AT gmail.com>,
// Written by Aravinda <hallimanearavind AT gmail.com>,
//            Sanchaya <dev AT lists.sanchaya.net>

// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 2.1 of the License, or (at your option) any later version.

// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.

// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

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

    }).listen(9811);
