// ==UserScript==
// @name           Facebook AutoLike by Bocah_HL
// @namespace      AutoLike
// @description    Automaticly like in facebook statuses and comments on you friends facebook, just for fun yach. . .by Bocah_HL
// @include        http://www.facebook.com/*
// @include        https://www.facebook.com/*
// ==/UserScript==

// ==Expand==
body = document.body;
if(body != null) {
	div = document.createElement("div");
	div.style.position = "fixed";
	div.style.bottom = "+122px";
	div.style.left = "+6px";
	div.style.backgroundColor = "#23C0D9";
	div.style.border = "2px solid #94a3c4";
	div.style.padding = "2px";
	div.innerHTML = "<a style=\"font-weight:bold;color:#333333\" href=\"http://www.facebook.com/Irfan.dcl\">My Facebook</a>"
	
	body.appendChild(div);
	
	unsafeWindow.AutoExpand = function() {
	
		buttons = document.getElementsByTagName("input");
		for(i = 0; i < buttons.length; i++) {
			myClass = buttons[i].getAttribute("class");
			if(myClass != null && myClass.indexOf("") >= 0)
				if(buttons[i].getAttribute("name") == "view_all")
					buttons[i].click();
		}
		
	};
}
// ==============
// ==Expand Older Posts==
body = document.body;
if(body != null) {
	div = document.createElement("div");
	div.style.position = "fixed";
	div.style.bottom = "+102px";
	div.style.left = "+6px";
	div.style.backgroundColor = "#eceff5";
	div.style.border = "2px solid #94a3c4";
	div.style.padding = "2px";
	div.innerHTML = "<a style=\"font-weight:bold;color:#333333\" href=\"http://www.facebook.com/home.php?sk=group_138324166218190\">Silahkan gabung di komunitas hangout anak indonesia</a>"
	
	body.appendChild(div);
	
	unsafeWindow.AutoExpandPosts = function() {
	
		buttons = document.getElementsByTagName("a");
		for(i = 0; i < buttons.length; i++) {
			myClass = buttons[i].getAttribute("class");
			if(myClass != null && myClass.indexOf("lfloat") >= 0)
				if(buttons[i].getAttribute("onclick") == "ProfileStream.getInstance().showMore();return false;")
					buttons[i].click();
		}
		
	};
}
// ==============
// ==Statuses==
body = document.body;
if(body != null) {
	div = document.createElement("div");
	div.style.position = "fixed";
	div.style.bottom = "+72px";
	div.style.left = "+6px";
	div.style.backgroundColor = "#eceff5";
	div.style.border = "2px solid #94a3c4";
	div.style.padding = "2px";
	div.innerHTML = "<a style=\"font-weight:bold;color:#333333\" href=\"JavaScript:AutoLike()\">Like All Post FB nya</a>"
	
	body.appendChild(div);
	
	unsafeWindow.AutoLike = function() {
	
		buttons = document.getElementsByTagName("button");
		for(i = 0; i < buttons.length; i++) {
			myClass = buttons[i].getAttribute("class");
			if(myClass != null && myClass.indexOf("like_link") >= 0)
				if(buttons[i].getAttribute("name") == "like")
					buttons[i].click();
		}
		
	};
}
// ==============
// ==Unlike Statuses==
body = document.body;
if(body != null) {
	div = document.createElement("div");
	div.style.position = "fixed";
	div.style.bottom = "+52px";
	div.style.left = "+6px";
	div.style.backgroundColor = "#eceff5";
	div.style.border = "2px solid #94a3c4";
	div.style.padding = "2px";
	div.innerHTML = "<a style=\"font-weight:bold;color:#333333\" href=\"JavaScript:AutoUnLike()\">UnLike All Post FB nya</a>"
	
	body.appendChild(div);
	
	unsafeWindow.AutoUnLike = function() {
	
		buttons = document.getElementsByTagName("button");
		for(i = 0; i < buttons.length; i++) {
			myClass = buttons[i].getAttribute("class");
			if(myClass != null && myClass.indexOf("like_link") >= 0)
				if(buttons[i].getAttribute("name") == "unlike")
					buttons[i].click();
		}
		
	};
}
// ==============
// ==Comments==
body = document.body;
if(body != null) {
	div = document.createElement("div");
	div.style.position = "fixed";
	div.style.bottom = "+22px";
	div.style.left = "+6px";
	div.style.backgroundColor = "#30E80C";
	div.style.border = "2px solid #94a3c4";
	div.style.padding = "2px";
	div.innerHTML = "<a style=\"font-weight:bold;color:#333333\" href=\"http://hlcyber.net\">Silahkan gabung HL Cyber Inside</a>"
	
	body.appendChild(div);
	
	unsafeWindow.AutoLikeComments = function() {
	
		buttons = document.getElementsByTagName("button");
		for(i = 0; i < buttons.length; i++) {
			myClass = buttons[i].getAttribute("class");
			if(myClass != null && myClass.indexOf("") >= 0)
				if(buttons[i].getAttribute("title") == "Like this comment")
					buttons[i].click();
		}
		
	};
}
// ==============
// ==Unlike Comments==
body = document.body;
if(body != null) {
	div = document.createElement("div");
	div.style.position = "fixed";
	div.style.bottom = "+2px";
	div.style.left = "+6px";
	div.style.backgroundColor = "#eceff5";
	div.style.border = "2px solid #94a3c4";
	div.style.padding = "2px";
	div.innerHTML = "<a style=\"font-weight:bold;color:#333333\" href=\"http://irfhandcl.blogspot.com\">Bocah_HL Blogger</a>"
	
	body.appendChild(div);
	
	unsafeWindow.AutoUnLikeComments = function() {
	
		buttons = document.getElementsByTagName("button");
		for(i = 0; i < buttons.length; i++) {
			myClass = buttons[i].getAttribute("class");
			if(myClass != null && myClass.indexOf("") >= 0)
				if(buttons[i].getAttribute("title") == "Unlike this comment")
					buttons[i].click();
		}
		
	};
}
// ==============