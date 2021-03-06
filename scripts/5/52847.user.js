// ==UserScript==
// @name           Pennergame: Pfandflaschen-Auto-Verkauf & Pfandkurs-Auto-Aktualisierung
// @namespace      Pennergame
// @description    Verkauft automatisch bei angegebenem MindestPfand-Wert und aktualisiert Pfandkurs sekuendlich.
// @version        1.2
// @author		     NettiCat (armab Penner)
// @include        http://berlin.pennergame.de/*
// @exclude        *.highscore.*
// @exclude        *.*board.*
// ==/UserScript==



//Verkaufen wenn Kurs mindestens (0=niemals automatisch verkaufen):
var minflaschenkurs = 16;













var sellnow = 0;
function request(){ 
try{
GM_xmlhttpRequest({
    method: 'GET',
    url: 'http://berlin.pennergame.de/stock/bottle/',
    onload: function(responseDetails) {
				if (responseDetails.status != 200) {
					GM_log('Invalid response');
					return;
				}
				var nod = responseDetails.responseText.match(/pfandflaschen_kurs_ajax[^>]+>["']?\d+/mi);//use response
				if(!nod)
					return;
				nod = String(nod).replace(/[^\d]+/i, '');
        var newkurs = parseInt(nod);
				if(!newkurs || isNaN(newkurs))
					return;
				var tc = document.getElementById("pfandflaschen_kurs_ajax");
				if(tc)
				tc.textContent = (/\:\d+/.test(tc.textContent)) ? ("." + newkurs) : (":" + newkurs);//some animation is nicer
				if (newkurs >= minflaschenkurs)
				{
						var tosell = responseDetails.responseText.match(/<input[^>]+id=["']max["'][^>]+value=["']?\d+/mi);//use response
						if(!tosell)
							return;
						tosell = parseInt(String(tosell).replace(/[^\d]+/i, ''));
						if(!tosell || isNaN(tosell))
							return;
						if(minflaschenkurs && tosell)
						{
							sellnow = 1;
							if(window.location.href != "http://berlin.pennergame.de/stock/bottle/")
								window.location.replace("http://berlin.pennergame.de/stock/bottle/"); 
							else
								sellbottles();
						}
				}
    }
});
}catch(e){}

};


function loadsellbottles(){ 
	if(window.location.href != "http://berlin.pennergame.de/stock/bottle/")
		return;
	sellbottles();
};



function sellbottles(){ 
	try{
		if(!sellnow || !minflaschenkurs)
			return;
		sellnow = 0;
		GM_log('Verkaufe Flaschen!...');
		var max = parseInt(document.getElementById("max").value);
		if(!max || isNaN(max))
			return;
		document.getElementById("menge_verkauf").value = parseInt(document.getElementById("max").value);
		var forms = document.getElementsByTagName('form'); 
		if(forms[1].action == "http://berlin.pennergame.de/stock/bottle/sell/")
			forms[1].submit();
	}catch(e){}
};




window.setInterval(request, 1000);
window.document.addEventListener("pageshow", function(evnt){loadsellbottles();},true);




