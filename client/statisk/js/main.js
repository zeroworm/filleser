function make(filListe){
  filListe[0]={type:"dir",name:"/.dir",parent:'/',adresse:"/"};
  function getSize(key){
    var size=0;
    filListe[key].children.forEach(function(x){
      if(filListe[x].type!=='dir'){
        size+=filListe[x].size;
      }else{
        size+=getSize(x);
      }
    });
    return size;
  }
  
  for(var key in filListe){
    var i=filListe[key];
    if(i.type==='dir'){
      i.size=0;
      i.children=[];
    }else{
      i.size=Number(i.size);
    }
  }
  
  for(var key in filListe){
    if(filListe[key].parent!=='/'){
      filListe[filListe[key].parent].children.push(key);
    }
  }
  
  for(var key in filListe){
    if(filListe[key].type==='dir'){
      filListe[key].size=getSize(key);
    }
  }
}

tegnig={
  currentDir:0,
  currentUtvalg:-1,
};

window.onload=function(){
  var arbeid=document.getElementById('arbeid');
  var lerret=document.getElementById('lerret');
  
    
  function tegne(filListe){
    var vis=filListe[tegnig.currentDir].children;
    vis.forEach(function(x){
      lerret.innerHTML+='<article class="'+filListe[x].type+' icon"><span class="klikkbar">'+filListe[x].name+'</span></article>';
    });
  }
  
  var fillisteReq=new XMLHttpRequest();
  fillisteReq.open('GET','/filliste');
  fillisteReq.onreadystatechange=function(){
    if (fillisteReq.readyState===4 && fillisteReq.status===200){
      var filListe=JSON.parse(fillisteReq.responseText);
      make(filListe);
      tegne(filListe);
    }
  };
  fillisteReq.send(null);
};