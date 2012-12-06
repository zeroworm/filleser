window.onload=function(){
  var adresse=document.getElementById('adresse');

  adresse.onfocus=function(){
    this.select();
  }
  adresse.focus();
  
  adresse.onkeyup=function(){
    if(event.keyCode===13){
      var berOm=new XMLHttpRequest();
      berOm.open('POST','/filliste');
      berOm.onreadystatechange=function(){
        if(berOm.readyState===4 && callback){
          callback(berOm);
        }
      };
      berOm.setRequestHeader('Content-Type','application/json');
      berOm.send(JSON.stringify(adresse.value));
    }
  }
};