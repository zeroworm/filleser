var arbeid,vis,lerret,tool;

function klikk(elementer){
  for(var i=0;i<elementer.length;i++){
    elementer[i].onclick=function(){
      var identitet=Number(this.id.split('_')[1]);
      if(tegnig.filListe[identitet].type==='dir'){
        tegnig.currentDir=identitet;
        tegnig.currentElement=identitet;
        tegnig.tegne();
      }else{
        tegnig.currentDir=tegnig.filListe[identitet].parent;
        tegnig.currentElement=identitet;
        tegnig.tegne();
      }
    };
  }
}

function make(liste){
  liste.forEach(function(objekt,i,l){
    objekt.id=i;
    if(objekt.type==='dir'){
      objekt.size=0;
      objekt.children=[];
    }else{
      objekt.size=Number(objekt.size);
    }
  });
  
  var dirListe=liste.filter(function(objekt){
    return objekt.type==='dir';
  });
  
  var filListe=liste.filter(function(objekt){
    return objekt.type!=='dir';
  });
  
  liste=[{type:"dir",name:"/.dir",parent:'/',adresse:"/",id:-1,children:[],size:0}];
  
  dirListe.sort(function(a,b){
    if(a.name<b.name) return -1;
    if(a.name>b.name) return 1;
    return 0;
  });
  
  filListe.sort(function(a,b){
    if(a.name<b.name) return -1;
    if(a.name>b.name) return 1;
    return 0;
  });
  
  liste=liste.concat(dirListe,filListe);
  
  liste.forEach(function(objekt){
    if(objekt.parent!=='/'){
      for(var i=0;i<liste.length;i++){
        if(objekt.parent===liste[i].id){
          objekt.parent=i;
          break;
        }
      }
    }
  });

  function getSize(objekt){
    var size=0;
    objekt.children.forEach(function(x){
      if(liste[x].type!=='dir'){
        size+=liste[x].size;
      }else{
        size+=getSize(liste[x]);
      }
    });
    return size;
  }
  
  liste.forEach(function(objekt,i,l){
    delete objekt.id;
    if(objekt.parent!=='/'){
      l[objekt.parent].children.push(i);
    }
  });
  
  liste.forEach(function(objekt){
    if(objekt.type==='dir'){
      objekt.size=getSize(objekt);
    }
  });
  return liste;
}

tegnig={
  currentDir:0,
  currentElement:0,
  aktivDir:[],
  filListe:[],
  getAktiv:function(){
    var self=this;
    this.aktivDir=[];
    if(this.currentDir===0){
      return;
    }
    for(var x=this.filListe[this.currentDir].parent;this.filListe[x].parent!=='/';x=this.filListe[x].parent){
      this.aktivDir.unshift(x);
    }
    this.aktivDir.unshift(0);
  },
  velg:function(){
    var valgt=document.getElementsByClassName('valgt');
    for(var i=0;i<valgt.length;i++){
      valgt[i].classList.remove('valgt');
    }
    document.getElementById('element_'+this.currentElement).classList.add('valgt');
  },
  getUpper:function(){
    var self=this;
    this.getAktiv();
    var aktivListe=this.aktivDir;
    vis.innerHTML='<article class="dir ikon aktiv"><span id="element_0" class="klikkbar">/.dir</span></article><article class="fjerne"></article>';
    while(aktivListe.length!==0){
      var barn=this.filListe[aktivListe.shift()].children;
      barn.forEach(function(x){
        var aktivere='';
        if(self.aktivDir.indexOf(x)!==-1 || x==self.currentDir)aktivere='aktiv';
        vis.innerHTML+='<article class="'+self.filListe[x].type+' ikon '+aktivere+'"><span id="element_'+x+'" class="klikkbar">'+self.filListe[x].name+'</span></article>';
      });
      vis.innerHTML+='<article class="fjerne"></article>';
      var elementer=vis.getElementsByClassName('klikkbar');
      klikk(elementer);
    }
  },
  tegne:function(){
    var self=this;
    lerret.innerHTML='';
    document.getElementById('filName').innerHTML='<span class="data">name: '+tegnig.filListe[this.currentElement].name+'</span>';
    document.getElementById('size').innerHTML='<span class="data">size: '+tegnig.filListe[this.currentElement].size+'</span>';
    document.getElementById('adresse').innerHTML='<span class="data">adresse: '+tegnig.filListe[this.currentElement].adresse+'</span>';
    this.getUpper();
    var barn=this.filListe[tegnig.currentDir].children;
    barn.forEach(function(x){
      lerret.innerHTML+='<article class="'+self.filListe[x].type+' ikon"><span id="element_'+x+'" class="klikkbar">'+self.filListe[x].name+'</span></article>';
    });
    this.velg();
    var elementer=lerret.getElementsByClassName('klikkbar');
    klikk(elementer);
  },
};

window.onload=function(){
  arbeid=document.getElementById('arbeid');
  vis=document.getElementById('vis');
  tool=document.getElementById('tool');
  lerret=document.getElementById('lerret');
  
  var fillisteReq=new XMLHttpRequest();
  fillisteReq.open('GET','/filliste');
  fillisteReq.onreadystatechange=function(){
    if (fillisteReq.readyState===4 && fillisteReq.status===200){
      tegnig.filListe=make(JSON.parse(fillisteReq.responseText));
      tegnig.tegne();
    }
  };
  fillisteReq.send(null);
};