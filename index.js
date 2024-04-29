var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();

var myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({limit: myLimit}));

app.all('*', function (req, res, next) {

    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        let targetURL = req.query.url;
        console.log('proxying request to: ', targetURL);
        // make request to target URL and send the response
        request({url: targetURL, method: req.method, json: req.body}, function (error, response, body) {
            if (error) {
                console.error('error: ', error);
            }
            console.log('proxy response: ', response && response.statusCode);
        }).pipe(res);
    }
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});
