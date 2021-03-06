// ==UserScript==
// @name          Shows the Password on MouseOverby CYRIAC
// @namespace     cyriac
// @include https://www.orkut.com/*
// @include https://www.orkut.co.in/*
// @description	  shows password when mouse is moved over password field
// ==/UserScript==
(function() {
  var inputs, input;
  inputs = document.evaluate(
    '//input[@type="password"]',
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
  if(!inputs.snapshotLength) return;
  for(var i = 0; i < inputs.snapshotLength; i++) {
    input = inputs.snapshotItem(i);
    input.addEventListener('mouseover', function(event) {
      this.type = 'text';
    }, false);
    input.addEventListener('mouseout', function(event) {
      this.type = 'password';
    }, false);
  }
})();

