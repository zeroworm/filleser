var http=require('http');
var url=require('url');

function start(route,handle){
  function onRequest(req,res){
    var data='';
    var pathname=url.parse(req.url).pathname;
    req.on('data',function(dataChunk){
      data+=dataChunk;
    });
    req.on('end',function(){
      console.log(data);
      route(handle,pathname,res);
    });
  }
  http.createServer(onRequest).listen(8000);
  console.log('server started');
}

exports.start=start;
