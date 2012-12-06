var server=require('./server');
var router=require('./router.js');
var requestHandler=require('./requestHandler');

var handle={
  '/':requestHandler.start,
  '/main.js':requestHandler.getECMA,
  '/main.css':requestHandler.getCSS,
  '/delete':requestHandler.remove,
  '/filliste':requestHandler.filListe,
};

server.start(router.route,handle);
