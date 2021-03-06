// ==UserScript==
// @name           Yahoo Fantasy Game Log Tooltip
// @description    Displays a tooltip when mouse is hovered over gamelog image.
// @include        *baseball.fantasysports.yahoo.com/*
// @include        *football.fantasysports.yahoo.com/*
// @include        *basketball.fantasysports.yahoo.com/*
// @include        *hockey.fantasysports.yahoo.com/*
// @author         (c) 2007 Tim Wilson <timwilson01 at yahoo dot com>
// @require        http://yui.yahooapis.com/2.5.2/build/yahoo-dom-event/yahoo-dom-event.js
// @require        http://yui.yahooapis.com/2.5.2/build/animation/animation-min.js
// @grant		GM_xmlhttpRequest
// @grant		GM_addStyle
// ==/UserScript==
/*
 * Most of the credit for this goes to Glenn Carr <glenn at glenncar dot com>
 * and his excellent Fantasy Baseball Player Notes script:
 *    http://userscripts.org/scripts/show/9387
 *
 * Known Issues:
 *	In football, there's a "High Score of the Week" flash on the league page
 *	that can overlap the tooltip that this script displays.
 *
 * Updates:
 *	2007/09/19: Now works for football and basketball.
 *	2007/11/01: Also works for hockey.
 *	2008/08/30: Should now work for Firefox 3.
 */

(function() {

var Y   = YAHOO,
    yut = Y.util,
    yud = yut.Dom,
    yue = yut.Event,
    yua = yut.Anim;

var GameLog = function () {
  // -- Private Variables ------------------------------------------------------
  var infoCache    = {},
      descTimeout  = null,
      WORKING_IMG_URL = "data:image/gif,GIF89a%0A%00%0A%00%91%03%00%CC%CC%CC%FFff%FF%00%00%FF%FF%FF!%FF%" +
"0BNETSCAPE2.0%03%01%00%00%00!%F9%04%05%00%00%03%00%2C%00%00%00%00%0A%00%0A%00%00%02%17%9C'r%06%80%1A%" +
"02s'%AE%3Bqk%9A%E2%C3%81%14Gz%D9Q%00%00!%F9%04%05%00%00%03%00%2C%01%00%00%00%08%00%03%00%00%02%0A%9C%" +
"136%22%83%03%00S%10%14%00!%F9%04%05%00%00%03%00%2C%00%00%00%00%06%00%06%00%00%02%0C%9C%070%11%A8%7C%A" +
"2%11%22%D2X%00%00!%F9%04%05%00%00%03%00%2C%00%00%01%00%03%00%08%00%00%02%0A%1C%608%13%C1%BE%96%10c%16" +
"%00!%F9%04%05%00%00%03%00%2C%00%00%04%00%06%00%06%00%00%02%0A%04%86c%C9%1C%E1%A0%10l%16%00!%F9%04%05%" +
"00%00%03%00%2C%01%00%07%00%08%00%03%00%00%02%0A%04%86%23b%13%A1Dz%A9%00%00!%F9%04%05%00%00%03%00%2C%0" +
"4%00%04%00%06%00%06%00%00%02%0C%9C'r%A8%BB%11%06%00%03Jz%0A%00!%F9%04%09%00%00%03%00%2C%07%00%01%00%0" +
"3%00%08%00%00%02%0A%94f%A3%1A1%BD%00%18r%14%00%3B";

  return {
    // -- Public Methods -------------------------------------------------------

    /**
     * Initializes the GameLog module, injecting HTML and CSS into the page
     * and attaching event handlers. This method must be called AFTER the YUI
     * libs are loaded.
     */
    init: function () {
      this.inject();

      // Create custom events.
      this.onGameLogReceived = new yut.CustomEvent('gameLogReceived', this);

      // Attach event handlers.
      var gameLogImages = yud.getElementsBy(function(el) { return /gamelog/i.test( el.href ); }, 'a');

      yue.addListener(gameLogImages, 'mouseover', this.showDesc, this, true);
      yue.addListener(gameLogImages, 'mouseout', this.hideDesc, this, true);

      this.onGameLogReceived.subscribe(function (e, args) {
        this.refreshDesc(args[0]);
      }, this, true);
    },

    /**
     * Injects markup and CSS used for the tooltips.
     */
    inject: function () {
      GM_addStyle(
          '.gameloginfo { text-align:left; float:left; margin:10px 0 0 10px !important; width:auto; background: url(http://us.i1.yimg.com/us.yimg.com/i/us/sp/fn/default/full/drop_shadow.gif) no-repeat bottom right; }' +
          '.gameloginfo div.loading { display:block; position:relative; background:#ffffcc; border:1px solid #333333; margin: 0 4px 4px 0; padding: 4px; font-style: italic; color: #666666; font-size: 80% }' +
          '.gameloginfo div.inner { display:block; position:relative; background:#ffffcc; border:1px solid #333333; margin: 0 4px 4px 0; padding:4px }' +
          '.gameloginfo div.inner table thead th { font-size: 11px; border-bottom: 1px solid #666666; padding-right: 10px; text-align: center; }' +
          '.gameloginfo div.inner table tbody td { font-size: 11px; border-bottom: 1px solid #666666; padding-right: 10px; text-align: right; }'
      );

      var div = document.createElement( 'DIV' );
      div.id = 'gamelogdesc';
      div.style.display = 'none';
      div.style.height = '0px';
      div.setAttribute( 'class', 'gameloginfo' );
      div.style.zIndex = 99;
      document.body.appendChild( div );

	  var gSpan = document.createElement('span');
	  gSpan.id = 'gspan';
	  gSpan.style.display = 'none';
	  gSpan.style.height = '0px';
	  gSpan.style.zIndex='99';
	  document.body.appendChild(gSpan);
    },

    /**
     * Downloads the player page at the specified URL and caches it for
     * future use.
     *
     * @param {String} player page url
     */
    getGameLog: function (url) {
      if (infoCache.hasOwnProperty(url)) {
        this.onGameLogReceived.fire(infoCache[url]);
        return;
      }

      GM_xmlhttpRequest({
        method: 'GET',
        url   : url,
        onload: function (response) {
          infoCache[url] = response.responseText;
          GameLog.onGameLogReceived.fire(response.responseText);
        }
      });
    },

    /**
     * Hides the game log tooltip.
     */
    hideDesc: function (e) {
      clearTimeout(descTimeout);
      yud.setStyle('gamelogdesc', 'display', 'none');
    },

    /**
     * Refreshes the game log tooltip when player info is received.
     *
     * @param {String} gameLogContent contents of the game log page
     */
    refreshDesc: function (gameLogContent) {
      var gameLogTooltip = yud.get('gamelogdesc');
	  var gSpan = yud.get('gspan');

	  gameLogTooltip.innerHTML = '<div class="inner">No games.</div>';

	  gameLogContent = gameLogContent.replace(/[\r\n]+/g, '');

	  if( gameLogContent.match(/data-container/) ) {
		gSpan.innerHTML = gameLogContent.replace(/.*<div class="data-container">/, '<div>').replace(/Game Log/, '').replace(/<caption>.*<\/caption>/, '');
		var statTable = gSpan.getElementsByTagName('table')[0];
		if(statTable !== undefined) {
		  gameLogTooltip.innerHTML = '<div class="inner"><table cellspacing="0">' + statTable.innerHTML + '</table></div>';
		  var th = gameLogTooltip.getElementsByTagName('th');
		  for(var i = 0; i < th.length; i++ ) {
			th[i].setAttribute('style', '');
		  }
		}
	  }
    },

    /**
     * Shows the tooltip after a delay.
     */
    showDesc: function (e) {

      descTimeout = setTimeout(function () {
        var gameLogTooltip  = yud.get('gamelogdesc'),
            gameLogLink  = yue.getTarget(e).parentNode,
            anim       = new yua(gameLogTooltip, {opacity: {to: 1.0}}, 0.4, yut.Easing.easeBoth);

        gameLogTooltip.innerHTML = '<div class="loading">Loading...<img align="absmiddle" src="' + WORKING_IMG_URL + '"/></div>';

        GameLog.getGameLog(gameLogLink.href);

        yud.setStyle(gameLogTooltip, 'opacity', 0.0);
        yud.setStyle(gameLogTooltip, 'display', 'block');

        yud.setXY(gameLogTooltip, [yud.getX(gameLogLink),
            yud.getY(gameLogLink) + gameLogLink.offsetHeight + 18]);

        anim.animate();
      }, 100);
    }
  };
}();

GameLog.init();
})();
