// ==UserScript==
// @name           Deezer HQ No Limit
// @namespace      Deezer
// @description    This script works with new Deezer template ! Enjoy ! ;)
// @include        htt*://*.deezer.com/*
// @grant          none
// @match	   http://*.deezer.com/*
// @match	   https://*.deezer.com/*
// @icon           http://img15.hostingpics.net/pics/464482Deezer.jpg
// @version        2.0
// @encoding       UTF-8
// ==/UserScript==


function deezerUnlimited() {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.textContent = "function loadFacebox(page){if (page == 'login.php' || page == 'register.php') {try{dclk_hide();$('.tipsy').remove();$('#hovercard').hide();$('#sharebox').remove();$('#favoritebox').remove();$('#facebox_overlay').fadeOut();if(typeof(actual_box)!='undefined'&&actual_box.substr(0,6)=='video/'){$('#naboo_video_player').text('');}if(page=='orange/promo.php'||page=='orange/return.php'){user.logout();}param=page.split('?');if(typeof(param[1])!='undefined'){var query_param=param[1];}else{var query_param='';}if(typeof(param[0])!='undefined'&&param[0]=='register.php'&&PAYMENT_PLATFORM_VERSION==2&&query_param.match(new RegExp('id=([0-9]+)'))&&!query_param.match(new RegExp('message=(push_signup|push_subscribe)'))){var regex_origin=new RegExp('origin=([0-9]+)');var match_origin=query_param.match(regex_origin);if(match_origin==null){query_param='origin=0&'+query_param;}var regex_test_id=new RegExp('test_id=([0-9]+)');var match_test_id=query_param.match(regex_test_id);if(match_test_id==null){query_param='test_id=0&'+query_param;}var url=SETTING_HOST_SITE+'/payment/go.php?'+query_param;window.location=url;return;}jQuery.facebox({ajax:'/'+SETTING_LANG+'/'+param[0]+'?checkForm='+encodeURIComponent(checkForm)+'&'+query_param});return;}catch(e){console.log(e.message,e.stack);}}else{console.log('PAS DE PUB DEEZER STP');}}dzPlayer.setForbiddenListen = function(status) {try {if(dzPlayer.version == 1) {dzPlayer.user_status.limited = false;this.trigger('audioPlayer_setLock', [dzPlayer.user_status.limited])}} catch(e) {console.log(e.message, e.stack)}};$('.timeline_t-b .remaining').css('background', 'green');dzPlayer.setForbiddenListen(false);naboo.removeAds();$('#ads_300x250').remove();$('.area_picto_t-b').remove();USER.OPTIONS.ads_display = false;USER.OPTIONS.ads_audio = false;USER.OPTIONS.dj = true;USER.OPTIONS.web_hq = true;USER.OPTIONS.web_offline = true;USER.OPTIONS.web_streaming = true;USER.OPTIONS.web_streaming_duration = 999999999;USER.OPTIONS.web_streaming_free_tracks = 999999999;DZPS = true;$('#btnMixage').show();$('#header_content_restriction_hovercard').hide();if($('#push_abo').length > 0){$('#push_abo').remove();}$('#header_content_restriction').unbind('mouseover').bind('mouseover', function(){$('.header_hovercard').show();});$('#header_content_restriction .header_hovercard').html('<div class=\"h_hovercard_t-b box-shadow\" style=\"height:57px\"><span class=\"arrow_hovercard t_arrow\"></span><div><h4 class=\"discovery\" style=\"display: block\">Premium by Kheos !</h4><h4 class=\"t-b\" style=\"display: none\">Premium by Kheos !</h4></div><hr><div><p class=\"discovery\" style=\"display: block\"><span class=\"fc_link\">Unlimited Listening !</span></div></div>');$('#header_content_restriction').css('cursor','default');";
    document.body.appendChild(script);
}
deezerUnlimited();
setInterval(deezerUnlimited, 5000);


