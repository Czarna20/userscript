// ==UserScript==
// @name           PIDKY Chat
// @author         Vali-Pastila CoiTe Mari
// @namespace      http://userscripts.org/scripts/show/142066
// @include        http://s111-ro.ogame.gameforge.com/game/index.php?page=alliance
// arroba include        http://*.ogame.org/game/index.php?page=networkkommunikation*
// ==/UserScript==
// Version 1.1


(function(){
  //var elemento = document.getElementById('section31');  //para ponerlo debajo de los circulares
  var elemento = document.getElementById('planet');  //para ponerlo en la imagen
  var titulo = document.getElementsByTagName('h2');
  titulo[0].innerHTML = 'Chat-ul aliantei PIDKY';
  var p = document.createElement("p");
  var chat = '<embed src="http://www.xatech.com/web_gear/chat/chat.swf" quality="high" width="640" height="320" name="chat" FlashVars="id=191039433" align="middle" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" pluginspage="http://xat.com/update_flash.shtml" /><br>';
  elemento.setAttribute('style', 'height:346px;background-image:none;');
  p.setAttribute('style', 'margin:0px;');
  p.innerHTML = chat;
  elemento.appendChild(p);
})();