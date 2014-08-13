/**
 * Created by yarvyk on 13.08.2014.
 */

var fs = require('fs');
var crypto = require('crypto');

// the middleware function
module.exports = function(path, options){
    var options = options || {}
        , path = path || __dirname + '/public/fonts/open-sans.light.ttf'
        , maxAge = options.maxAge || 86400000
        , font; // favicon cache

    return function(req, res, next){
        if ('/fonts/open-sans.light.ttf' == req.url) {
            if (font) {
                res.writeHead(200, font.headers);
                res.end(font.body);
            } else {
                fs.readFile(path, function(err, buf){
                    if (err) return next(err);
                    font = {
                        headers: {
                            // http://stackoverflow.com/questions/2871655/proper-mime-type-for-fonts
                            'Content-Type': 'application/octet-stream'
                            , 'Content-Length': buf.length
                            , 'ETag': '"' + md5(buf) + '"'
                            , 'Cache-Control': 'public, max-age=' + (maxAge / 1000)
                        },
                        body: buf
                    };
                    res.writeHead(200, font.headers);
                    res.end(font.body);
                });
            }
        } else {
            next();
        }
    };
};

function md5(str, encoding){
    return crypto
        .createHash('md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex');
};
