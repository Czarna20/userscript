// ==UserScript==
// @name          4chan.js Spam Buster
// @namespace     http://www.userscripts.org
// @description   Gets rid of the 4chan.js spam on 4chan. This is a dirty modification of 4chan Spam Buster.
// @include       http://*4chan.org/*
// ==/UserScript==

(function() {
	var posts = document.getElementsByTagName("blockquote");
	for (i = 0; i < posts.length; i++)
	{
		if (posts[i].innerHTML.indexOf("Copy and paste the following to Notepad, save it as 4chan.js, open the file you saved and shit bricks.") != -1 || posts[i].innerHTML.indexOf("RAIDCHAN") != -1 || posts[i].innerHTML.indexOf("Kayla") != -1 || posts[i].innerHTML.indexOf("Luk0r") != -1 || posts[i].innerHTML.indexOf("Z0Mg") != -1)
		{
			posts[i].parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(posts[i].parentNode.parentNode.parentNode.parentNode);
			i = i - 1;
		}
	}
})()