var fs=require('fs');
var body=fs.readFileSync('../client/main.html');

function start(res){
  res.writeHead(200,{'Content-Type':'text/html'});
  res.write(body);
  res.end();
}

function remove(res){
  res.writeHead(200,{'Content-Type':'text/plain'});
  res.write('remove handler called');
  res.end();
}

function getECMA(res){
  fs.readFile('../client/statisk/js/main.js',function(err,data){
    res.writeHead(200,{'Content-Type':'application/ecmascript'});
    res.write(data);
    res.end();
  });
}

function getCSS(res){
  fs.readFile('../client/statisk/css/main.css',function(err,data){
    res.writeHead(200,{'Content-Type':'text/css'});
    res.write(data);
    res.end();
  });
}

function filListe(res){
  fs.readFile('./data/filliste.json',function(err,data){
    res.writeHead(200,{'Content-Type':'application/json'});
    res.write(data);
    res.end();
  });
}

exports.start=start;
exports.remove=remove;
exports.getECMA=getECMA;
exports.getCSS=getCSS;
exports.filListe=filListe;
