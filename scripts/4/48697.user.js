// ==UserScript==
// @name           Sportsfri Aftenposten
// @namespace      http://haakonnilsen.com
// @description    Aftenposten uten sport
// @include        http://www.aftenposten.no/*
// @include        https://www.aftenposten.no/*
// @grant          none
// ==/UserScript==

var boring = "sport|fotball|live";
var filterRE = new RegExp(boring);

var links = document.evaluate("//a",
                          document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i = 0; i < links.snapshotLength; i++) {
  var item = links.snapshotItem(i);
  if (filterRE.test(item)) {
    var parent = item.parentNode;
    parent.parentNode.removeChild(parent);
  }
}
