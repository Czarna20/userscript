// ==UserScript==
// @name           Secure
// @namespace    http://userscripts.org/scripts/show/44844
// @description    Secures applicable domains by using a secure environment / connection version of the website with the compatibility of SSL / HTTPS areas.
// @copyright      ScriptDeveloper
// @version        1.08
// @include        http://*paypal.*/
// @include        http://*.mozilla.org*
// @include        http://*isohunt.com*
// @include        http://*evernote.com*
// @include        http://*binsearch.info*
// @include        http://*binsearch.net*
// @include        http://groups.google.*
// @include        http://sites.google.*
// @include        http://*.amazon.*/
// @include        http://*opendns.com*
// @include        http://*eztv.it*
// @include        http://*orkut.com*
// @include        http://*orkut.co.in*
// @include        http://*twitter.com*
// @include        http://*thepiratebay.org*
// @include        http://login.yahoo.com*
// @include        http://*sourceforge.net/projects/*
// @include        http://gmail.google.com*
// @include        http://*mail2web.com*
// @include        http://login.live.com*
// @include        http://*registration.excite.com*
// @include        http://*proxy.org*
// @include        http://*proxify.com*
// @include        http://bugs.kde.org*
// @include        http://*inbox.com*
// @include        http://*mail.com*
// @include        http://*.aol.*
// @include        http://*bluebottle.com*
// @include        http://*vfemail.net*
// @include        http://*fastmail.ca*
// @include        http://*hushmail.com*
// @include        http://*mail2world.com*
// @include        http://*ureach.com*
// @include        http://*microsoft.*
// @include        http://*123cheapdomains.com*
// @include        http://*esignforms.com*
// @include        http://*stealthmessage.com*
// @include        http://*securenym.net*
// @include        http://*keptprivate.com*
// @include        http://*filefortress.com*
// @include        http://*securecomputing.com*
// @include        http://members.webs.com*
// @include        http://members.freewebs.com*
// @include        http://*last.fm*
// @include        http://*godaddy.com*
// @include        http://*apple.com*
// @include        http://*propeller.com*
// @include        http://*adobe.com*
// @include        http://*inbox.com*
// @include        http://*ezpzemail.com*
// @include        http://*twitter.com*
// @include        http://*canada.com*
// @include        http://*tv.com*
// @include        http://*meebo.com*
// @include        http://*openid.net*
// @include        http://*stumbleupon.com*
// @include        http://*mybloglog.com*
// @include        http://*addthis.com/
// @include        http://*google.*/m*
// @include        http://*google.*/accounts/*
// @include        http://*google.com/calendar*
// @include        http://mail.google.com*
// @include        http://docs.google.*
// @include        http://spreadsheets.google.*
// @include        http://*google.*/reader*
// @include        http://*google.*/bookmarks*
// @include        http://*google.*/history*
// @include        http://*google.*/notebook*
// @include        http://*google.*/support*
// @include        http://*fastmail.fm/mail*
// @include        http://*igoogle.*
// @include        http://login.passport.net*
// @include        http://bugs.gentoo.org*
// @include        http://forums.gentoo.org*
// @include        http://facebook.com/
// @include        http://www.facebook.com/
// @include        http://*101distribution.com*
// @include        http://*1040now.net*
// @include        http://*10kscholarship.com*
// @include        http://*192.com*
// @include        http://*1stfinancialfcu.org*
// @include        http://*firsttechcu.com*
// @include        http://*twitter.com*
// @include        http://*intuit.com*
// @include        http://*webtrafficschool.com*
// @include        http://*2mcctv.com*
// @include        http://*2sms.com*
// @include        http://*4structures.com*
// @include        http://*4mybenefits.com*
// @include        http://*877myjuicer.com*
// @include        http://*swreg.org*
// @include        http://*mcafeesecure.com*
// @include        http://*authorize.net*
// @include        http://*versapay.com*
// ==/UserScript==

if(/^http:\/\//.test(window.location)) {
window.location.replace(location.href.replace(/^http:/, 'https:'));
}