// ==UserScript==
// @name       My Fancy New Userscript
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @match      http://mls-spotlight.agentshowing.com/*
// @copyright  2012+, You
// ==/UserScript==

(function() {
    var player = document.getElementById("fancyMusicPlayer");
    var src = player.firstElementChild;
    src.href = "http://upload.wikimedia.org/wikipedia/commons/1/1d/Moonlight_Sonata_Presto.ogg";
})();