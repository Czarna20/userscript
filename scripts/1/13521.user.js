// ==UserScript==
// @name          Book Burro Taiwanese Experimental - Remixing the bookstore
// @namespace     http://overstimulate.com/userscripts/
// @description   Compare book prices from various book stores. Still having problem with pricing comparison 
// @include       http://amazon.com/*
// @include       http://www.amazon.com/*
// @include       http://www.powells.com/*
// @include       http://half.ebay.com/*
// @include       http://buy.com/*
// @include       http://www.buy.com/*
// @include       http://biblio.com/*
// @include       http://www.biblio.com/*
// @include       http://search.barnesandnoble.com/*
// @include       http://barnesandnoble.com/*
// @include       http://www.barnesandnoble.com/*
// @include       http://www.alldirect.com/*
// @include       http://www.bokus.com/*
// @include       http://www.internetbokhandeln.se/*
// @include       http://www.akademibokhandeln.se/*
// @include       http://akademibokhandeln.se/*
// @include       http://www.adlibris.se/*
// @include       http://*.bibl.liu.se/*
// @include       http://www.cdon.com/*
// @include       http://www.exlibris.se/*
// @include       http://www.libris.se/*
// @include       http://www.alibris.com/*
// @include       http://bookbyte.com/*
// @include       http://www.bookbyte.com/*
// @include       http://biggerbooks.com/*
// @include       http://www.biggerbooks.com/*
// @include       http://ecampus.com/*
// @include       http://www.ecampus.com/*
// @include       http://www.booksamillion.com/*
// @include       http://print.google.com/*
// @include       http://www.bookpool.com/*
// @include       http://bookpool.com/*
// @include       http://www.eslitebooks.com/*
// ==/UserScript==

var debug = 0;

// You are welcome either to put your own affiliate codes and dev keys below,
// or to leave them as is, sponsoring further development of this application
var abebooks_aid = 10395338, abebooks_pid = 1814912;
var amazon_associate_code = 'diaryohayou-20';
var amazon_dev_key = '05GK2S0SFN8G8P5KY482';
var bn_associate_code = 41532291;
var half_associate_code = 1814912; // (CJ PID, really -- not your CJ account number!)

// Of these, only name, id and bookURL are mandatory (but hostname, getISBN, ajaxURL and ajaxPrice are usually needed too).
// name: book store name listed in burro window
// id: a short unique id string for all document nodes related to this book store
// hostname: a hostname regexp used to determine whether to look for ISBNs on this page
// bookURL: address to link the name to, %s being replaced with the ISBN of the book
// getISBN: function run on book store pages to find the book ISBN it's about; returns false (no book), or an ISBN string
// -- or -- regexp applied to the full URL of the page, whose first matched paren pair gives the ISBN of the book shown
//       -- defaults to /isbn[\/=]([0-9X]{10})(&|\?|\.|$)/i if omitted
// ajaxURL: address to pick up price for the book whose ISBN is %s, for ajax handler (defaults to bookURL, if not given)
// ajaxData: '' by default; if given, the data to provide with the ajax request body, %s replaced with the ISBN of the book
// ajaxMethod: POST by default (if not given); which HTTP method to access the above
// ajaxHeaders: HTTP headers for the AJAX request. Adds a Content-Type: 'application/x-www-form-urlencoded' header for all
//              POST requests missing a content-type declaration.
// ajaxPrice: function run on fetched AJAX page to get book price; returns false (not found) or a price and currency string
//            or an associative array from store id to price and currency string, when one AJAX request can get many prices
//   -- or -- regexp (or string form, the latter mostly useful avoid quoting /:s) whose first paren picks up the book price
//   -- or -- false, in which case no xmlHTTPRequest is ever made (for instance because some other handler finds the price)
// priceFix: if ajaxPrice was a string and this function is provided, the resulting price is fed through the callback
// updateURL: if provided, a function run on the fetched AJAX page, to get a new (or proper) URL for the book link
var handlers = [
  { name: 'Abebooks.com', id: 'abebooks', hostname: /\babebooks.com$/i, getISBN: /(?:isbn|bi)=([0-9X]{10})(&|\?|$)/i,
    bookURL: 'http://www.abebooks.com/servlet/SearchResults?isbn=%s&pid='+ abebooks_pid +'&aid='+ abebooks_aid,
    ajaxPrice: /<span class="price">\D*(\$[^<]*)/i },
  { name: 'Ad Libris', id: 'alse', hostname: /\badlibris\.se$/i,
    bookURL: 'http://www.adlibris.se/shop/product.asp?isbn=%s',
    ajaxPrice: function( html, http )
    {
      if( html.match( 'Ingen titel med detta ISBN finns hos AdLibris.' ) )
	return '';
      return SEK( html.match( '<span class="price">([^<]*)<' )[1] );
    } },
  { name: 'Akademibokhandeln', id: 'abse', hostname: /\bakademibokhandeln\.se$/i,
    getISBN: nextSameTagAfter( 'td', '^ISBN' ),
    updateURL: firstLinkTo( 'cc_artikel.visa_artikelkort', 'http://www.akademibokhandeln.se/db/caweb/' ),
    bookURL: 'http://www.akademibokhandeln.se/db/caweb/sok.avanc_artiklar?mtitel=exact&cisbn=%s',
    ajaxPrice: /<span class="pris">\s*([^<]*)</i, priceFix: SEK },
  { name: 'Alibris', id: 'alibris', hostname: /\balibris\.com$/i,
    getISBN: nextTagAfter( 'b', 'ISBN:' ),
    bookURL: 'http://www.alibris.com/search/search.cfm', ajaxData: 'S=R&qisbn=%s',
    updateURL: firstLinkTo( '/search/detail.cfm?', 'http://www.alibris.com' ),
    ajaxPrice: /<span class="red-price"><b>([^<]*)</i },
  { name: 'AllDirect.com', id:'alldirect', hostname: /\balldirect\.com$/i,
    getISBN: nextTagAfter( 'b', 'ISBN:' ),
    bookURL: 'http://www.alldirect.com/book.asp?&isbn=%s',
    ajaxPrice: 'All Direct\x27s[^P]*Price[^\$]*([^<]*)<' },
  { name: 'Amazon', id: 'amazon', hostname: /\bamazon\.com$/i,
    getISBN: function() {
      if( location.href.match( 'rate-this' ) ) return;
      return location.href.match( /\/([0-9X]{10})(\/|\?|$)/i )[1];
    },
    bookURL: 'http://www.amazon.com/exec/obidos/ASIN/%s/'+ amazon_associate_code,
    ajaxURL: 'http://xml.amazon.com/onca/xml3?t='+ amazon_associate_code +'&dev-t='+ amazon_dev_key +'&type=lite&f=xml&mode=books&AsinSearch=%s',
    ajaxPrice: function( html, http )
    {
      var xml = str2xml( html );
      var our = xml.getElementsByTagName( 'OurPrice' );
      var used = xml.getElementsByTagName( 'UsedPrice' );
      return { amazon: our.length && our[0].childNodes[0].nodeValue || '',
	  amazon_used: used.length && used[0].childNodes[0].nodeValue || '' };
    } },
  { name: 'Amazon (used)', id: 'amazon_used', ajaxPrice: false,
    bookURL: 'http://www.amazon.com/exec/obidos/redirect?tag='+ amazon_associate_code +'&path=tg/stores/offering/list/-/%s/all/' },
  { name: 'Barnes & Noble', id: 'bn', hostname: /\bbarnesandnoble\.com$/i,
    bookURL: 'http://service.bfast.com/bfast/click?bfmid=2181&sourceid='+ bn_associate_code +'&bfpid=%s&bfmtype=book',
    ajaxURL: 'http://search.barnesandnoble.com/booksearch/isbninquiry.asp?isbn=%s',
    ajaxPrice: 'priceRightBNPrice[^>]*>([^<]*)</' },
  { name: 'Biblio.com', id: 'biblio', hostname: /\bbiblio\.com$/i,
    bookURL: 'http://www.biblio.com/isbn/%s.html', ajaxMethod: 'GET',
    ajaxPrice: /<td valign="top"><div[^>]*>\s*((?:&#036;|$)\S+)\s*</i },
  { name: 'BiggerBooks.com', id: 'biggerbooks', hostname: /\bbiggerbooks\.com$/i,
    bookURL: 'http://www.dpbolvw.net/click-'+ half_associate_code +'-9467039?ISBN=%s',
    ajaxURL: 'http://www.biggerbooks.com/bk_detail.asp?ISBN=%s', ajaxPrice: /<span class='price'>([^<]+)/ },
  { name: 'Bokus.com', id: 'bokus', hostname: /\bbokus\.com$/i,
    getISBN:/(?:\/|FAST_VALUE=ISBN&FAST=|ISBN=)([0-9X]{10})(\.html)?(\?|&|$)/i,
    bookURL: 'http://www.bokus.com/b/%s.html', 
    ajaxURL: 'http://www.bokus.com/cgi-bin/book_search.cgi?FAST_VALUE=ISBN&FAST=%s',
    ajaxPrice: '<span class="price">([^<]*)<', ajaxMethod: 'GET', priceFix: SEK },
  { name: 'Bookbyte', id: 'bookbyte_new', hostname: /\bbookbyte\.com$/i,
    getISBN: function(){ return document.getElementById('lbIsbn').textContent; },
    bookURL: 'http://www.kqzyfj.com/click-'+ half_associate_code +
	     '-10365617?url=http%3A%2F%2Fwww.bookbyte.com%2Fproduct.aspx%3Fisbn%3D%s',
    ajaxURL: 'http://www.bookbyte.com/product.aspx?isbn=%s', ajaxPrice: function( html, http ) {
      var prices = { bookbyte_new: html.match( '<span id="lbNewPrice">(?:<[^>]*>)*([^<]*)' ),
		     bookbyte_used: html.match( '<span id="lbUsedPrice">(?:<[^>]*>)*([^<]*)' ),
		     bookbyte_bazaar: html.match( '<a href="#Bazaar_Bookmark" class=price-red-14>([^<]*)' ) }, i;
      for( i in prices )
	prices[i] = prices[i] ? unHTML( prices[i][1] ).replace( /[^$.0-9]/g, '' ) : '';
      return prices;
    } },
  { name: 'Bookbyte (used)', id: 'bookbyte_used', ajaxPrice: false, bookURL: 'http://www.kqzyfj.com/click-'+ 
    half_associate_code +'-10365617?url=http%3A%2F%2Fwww.bookbyte.com%2Fproduct.aspx%3Fisbn%3D%s' },
  { name: 'Bookbyte (bazaar)', id: 'bookbyte_bazaar', ajaxPrice: false, bookURL: 'http://www.kqzyfj.com/click-'+ 
    half_associate_code +'-10365617?url=http%3A%2F%2Fwww.bookbyte.com%2Fproduct.aspx%3Fisbn%3D%s' },
  { name: 'Bookpool.com', id: 'bookpool', hostname: /\bbookpool.com$/i,
    getISBN: /(?:qs|is|sm)[\/=]([0-9X]{10})(&|\?|\.|$)/i,
    bookURL: 'http://www.bookpool.com/sm/%s',
    ajaxPrice: /Our\s+Price:?(?:<[^>]*>\s*)*([^<]+)/i },
  { name: 'Booksamillion.com', id: 'bamm', hostname: /\bbooksamillion\.com$/i,
    bookURL: 'http://www.dpbolvw.net/click-'+ half_associate_code +'-42121?isbn=%s', // /<B>Our\s+Price:\s*([^<]+)/i
    ajaxURL: 'http://www.booksamillion.com/ncom/books?type=isbn&find=%s', ajaxMethod: 'GET',
    ajaxPrice: function( html, http ){ return '$' + html.match( /Our\s+Price:\s*\$?([^<]+)/i )[1]; } },
  { name: 'Buy.com', id: 'buy', hostname: /\bbuy\.com$/i,
    getISBN: function(){ return document.title.match( /ISBN ([0-9X]{10})/i )[1]; },
    bookURL: 'http://www.buy.com/retail/GlobalSearchAction.asp?qu=%s',
    ajaxPrice: 'productPrice[^>]*>([^<]*)</' },
  { name: 'CDON.com', id: 'cdon', hostname: /\bcdon\.com$/i,
    getISBN: nextSameTagAfter( 'td', 'ISBN:' ), updateURL: function( html, http ) {
      return 'http://www.cdon.com/' + unHTML(html.match( /<a href=.(product\.phtml\?prod=\d+)/ )[1]);
    }, bookURL: 'http://www.cdon.com/search_result.phtml?ed_search_value=%s&sl_search_field=books_isbn',
    ajaxPrice: '<td[^>]* class=\'priceMedium\'[^>]*>([^<]*)<', ajaxMethod: 'GET', priceFix: SEK },
  { name: 'eCampus.com', id: 'ecampus', hostname: /\becampus.com$/i,
    bookURL: 'http://www.anrdoezrs.net/click-'+ half_associate_code +'-5029466?ISBN=%s',
    ajaxURL: 'http://www.ecampus.com/bk_detail.asp?ISBN=%s', ajaxPrice: /Our\s+Price\s*<font[^>]*>([^<]+)/i },
  { name: 'Ex Libris', id: 'exlibris', hostname: /\bexlibris\.se$/i,
    getISBN: nextSameTagAfter( 'span', 'ISBN:' ), updateURL: function( html, http ) {
      return 'http://www.exlibris.se/' + unHTML(html.match( '<form [^>]* action="([^"]*)' )[1]);
    }, bookURL: 'http://www.exlibris.se/advancedsearch.aspx?%s', ajaxMethod: 'GET',
    ajaxURL: 'http://www.exlibris.se/searchresult.aspx?TYPE=Simple&SEARCH_FIELD=2&SEARCH_FIELD_TEXT=ISBN&SEARCH_VALUE=%s&SHOW_IMAGES=true',
    ajaxPrice: /<span id="ctrlProductDetails_lblPrice">([^<]+)</, priceFix: SEK },
  { name: 'Google Print', id: 'googleprint', hostname: /print\.google\.com$/i,
    bookURL: 'http://print.google.com/print?as_isbn=%s',
    getISBN: function() {
      var re = new RegExp( 'https?://www.google.com/pagead/ads\\?.*' +
			   '&channel=[^&]*BTB-ISBN:([0-9X]{10})', 'i' );
      return firstDocumentLinkMatching( re, 1 );
    }, updateURL: firstLinkTo( 'http://print.google.com/print?', '' ),
    ajaxPrice: function( html, http ) {
      var re = new RegExp( '<a(?:[^>]*) href=["\']?' +
			   'https?://print.google.com/print\\?' +
			   '[^"\']*&sig=', 'i' );
      return html.match( re ) != null;
    } },
  { name: 'Half.com', id: 'half', hostname: /\bhalf\.ebay\.com$/i,
    getISBN: nextTagAfter( 'b', 'ISBN:' ),
    bookURL: 'http://www.kqzyfj.com/click-'+ half_associate_code +'-1932276?ISBN=%s',
    ajaxURL: 'http://half.ebay.com/search/search.jsp?product=books:isbn&query=%s',
    ajaxPrice: 'Best[^P]*Price[^$]*([^<]*)<' },
  { name: 'Internetbokhandeln', id: 'ibse', hostname: /\binternetbokhandeln\.se$/i,
    getISBN: /(?:\/bok|&s_search=)([0-9Xx]{10})(\.html)?(\?|$)/, updateURL: function( html, http )
    {
      return 'http://www.internetbokhandeln.se' + unHTML(html.match('<a href="?(/[^"]*/bok[0-9xX]{10}\\.html)')[1]);
    }, bookURL: 'http://www.internetbokhandeln.se/_114K3FPUVX/msearchres.html?s_sortby=b&s_media=ALL&s_type=i&s_search=%s',
    ajaxMethod: 'GET', ajaxPrice: '<span class=price>([^<]*)<', priceFix: SEK },
  { name: 'Libris Media', id: 'librismedia', hostname: /\blibris\.se$/i,
    getISBN: function(){ return document.body.innerHTML.match( /<span class=[^>]*>\s*ISBN ([0-9X]{10})/mi )[1]; },
    updateURL: firstLinkTo( 'Browse_Item_Details.asp', 'http://www.libris.se/stores_app/' ),
    bookURL: 'http://www.libris.se/stores_app/Browse_dept_items.asp?Store_id=102&fran=sok',
    ajaxData: 'SEARCH_SKU=%s&SEARCH_DEPT=-1&Search_Store.x=36&Search_Store.y=7',
    ajaxPrice: [/<span class="normal2">Pris:.*?<span[^>]*>(\d+)(,\d\d)? *kr</mi,
		/<b>\s*Libris l\345gpris (\d+)(,\d\d)? *kr/mi,
		/<span class="fakta">\s*(\d+)(,\d\d)? *kr/mi], priceFix: SEK },
  { name: 'LiU Library', id: 'liubibl', hostname: /\bbibl\.liu\.se$/i,
    getISBN: nextSameTagAfter( 'a', 'ISBN/ISSN:' ),
    bookURL: 'http://hip.bibl.liu.se/ipac20/ipac.jsp?menu=search&index=ISBN&term=%s',
    ajaxPrice: function( html, http )
    {
      var book, inne = 0, ute = 0;
      while( book = /<tr height="15">(.*?)<\/tr>/gi.exec( html ) )
	if( !book[1].match( /referens/i ) )
	  if( book[1].match( /tillg|reserverad/i ) )
	    inne++;
	  else
	    ute++;
      if( inne+ute )
      {
	html = inne;
	if( ute )
	  return html + ' (of '+(inne+ute)+')';
	return html + ' in';
      }
    } },
  { name: 'Powell\'s Books', id: 'powells', hostname: /\bpowells.com$/i,
    getISBN: function()
    {
      var dt = document.getElementsByTagName( 'dt' ), i;
      for( i=0; i<dt.length; i++ )
	if( dt[i].innerHTML.match( 'ISBN:' ) &&
	    checkISBN( dt[i].nextSibling.title ) )
	  return dt[i].nextSibling.title;
    },
    bookURL: 'http://www.powells.com/cgi-bin/biblio?isbn=%s',
    ajaxPrice: '<div class="price">([^<]*)<' },
  { name: 'ESlitebooks', id: 'eslitebooks', hostname: /\beslitebooks.com$/i,
    getISBN: function()
    {
      var t = document.getElementsByTagName( 'td' ), i , s;
      for( i=0; i<t.length; i++ )
	if( t[i].innerHTML.match( 'ISBN:' ) ) {
	  s = t[i].innerHTML;
	  s = s.substring(s.indexOf('\uFF0F')+1, s.indexOf('<'));
	  return s;
	}
    },
    updateURL: firstLinkTo( '/Program/Object/BookMD.aspx?', 'http://www.eslitebooks.com' ),
    bookURL: 'http://search.eslitebooks.com/search/searchResultSAP.asp?basadv=bas&Item=10&At=1&range=%B0%D3%AB~&SortType=0&qc=2&query=%e&FontType=Trid&SortType=0',
    ajaxPrice: '<font color="#cc0000">([^<]*)<' }    
  ];

var hasFetched = false;

var Icons =
{
  title: 'data:image/gif;base64,R0lGODlheAAOAOYAAAAAAOmUUUOGfx1eVj8/M1ijnqBhLrmFVv//zNi6oCUIAO/vwJqEbGk4EL+/mm9vWZmZmVpaWvfAl7ydiC8vJo+PcwAPCaJtSylNS////4tCC9/fs0MeAa+vjefy9LR1QpnMzH9/Zny3s7WIazttbG5MMVyVj09PQJ+fgMvO11UwEwMWGq10R5K6ugg2Nh8fGdiecOaxhdiKTAAACZlqPnWtqu/dxTxlYXNeS1o6IU8rEZqytlp2d4p4bDZ/dn+Eh4pWL2JNOFKLhf/frtusjtGFS750N8ulfo1qVM/Ppm2HhsSQa615UvSlYy5HS9rb1hAEDqdvPjgpJg8PDP/vx4S2s6toMzRERKmlmrS8vkFfXwAhHnI7Ek06K+3x8D92c6/M0DNmZk5nb4xNGr+8s9uNT8x9OysRAtSniJWOlq6GYwAICZGtsP+4dGVCLkaVj4GpqF9fTMuLW8q/ra1rOV1UTXpKJmaZmb+SabGzstWXZEtMTmg9G4RZN4rFwVZeYSH5BAUUAAgALAAAAAB4AA4AAAf/gAiCg4MzM4SIgyo5hGcKj1JTiZOUlZaXmJmagmtrPEprlRN9TA0ICjpIaiMjSEhdm7Gys7SInXd3JiQ3oZN8Bx9jXGpoaEtLFzRumkkEKLTNz4nRtbWGbHBVJttCJBaTDQYaYzASSzAHQCxEmw4AIbTu8Iny1bMzWTtwcH4Fbz4DBHhLZGfMmCJy5NCwY0qWuwdxCHQYVIHAiYmCkkR8sABBvQ4hkgx6GBFjCGknPYYkUCGEgwcnNix4QCCOyEsrVoBpUUOEvwIAw4T5RkjFmA8faPDhU8sdgAcUADhA8ODpCQATN0yhEGKrx3coAMQh5BSqVAQACAhKiyAEgCnv/94CAICAwpQQdjdcmiFmRQuf/nwICDMAA4ZeCLrouBClMR8VJUrMcjd2A4CYlwVNeYEgDgCRFQCgcHdVLVmxCCyfQGuardvVaD8jCFsBQRLUllY40eICRA0BwL8I7ZRhUA8VNAx8sIOGSoISy2LVYz2dAF3rguQ5xT3y3Vq1bFm3PSt+/NTyliyIwbAFhB+BJIinKC5oAh8WBqzAoEKFA5ISONTxRwqZPITAApfdNhYCL0hylV60uUNBVedl99SBmYXnGnnhhfaMapmsgYEY7bWwxRoZZJBCGlAMMgEQdMhghR5DxKAADWokYMMTWeyBiTtTdODZM3Z1EBo8HYjlgL9dC8izwBSmWRjkkAhMMeWG54WnFQUOeFbhJWtoocWJHqj4gyGE6MBCGQHIUIQZetBwAB5qBEGGF3n8KNYLFx541RQPDIICnxSIVE9Y0nwVB5+BzgbXCRSo5VaWUSYR1QuJhniFBRlkAQEAiA1yBgtFtNGEEUbQYUAUeKDBABYZPBGBPbTWWs1cP4BKyRk06NFEAKdawUIUTBBhgxfI+mjrssxiMpclXdhBRxlmmJEUDTQckcAcXnjwRKPNhltrIAA7',
  about: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAuJAAALiQE3ycutAAAAB3RJTUUH1QQYCDkprC+64gAAAOdJREFUKM+FkrFOAkEURc9ddrJZCgsqCwtCIiUFJa2df2CwNXRS8AmGisLEaGGs3VhTYDUtxZaED/AriGHjPhuEDC5wq3l5czL3vjeyzBlHtC6KoI4BuPk8Qqx3549rov3+YPBIp3NHq3VLlnkkBf0AWK2+6fevWCze8H7CaPRKUfzgnKsG0jSh272kLEuWyy/a7QvSNKnIsJEk6vWE2SxnPH5nOn3YWopjh9VqIbDBGA5fyPNnGo2znZVIEEWhJTNDgmbzfHvZzA6H/pP3k3/TqQQkIYle7z6oT74wnz8d3KNOfY19/QKFiTrWqbiPtAAAAABJRU5ErkJggg==',
  carrotRight: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1QQYCR020Q08hgAAAB10RVh0Q29tbWVudABDcmVhdGVkIHdpdGggVGhlIEdJTVDvZCVuAAAAiklEQVQY07XPIQoCURSF4e8NAzYxGicNuAa1WlyCO3AlZnfiNgwahQFxikkcBIsGfaZpzgODJ/4c/nMvPyR8g7EsephgH6q6aXnWIelhjkUsi0EL88TqFUfMYlnscMoS5wUccMYS4yxhfuGNPho88oQ5xxQjrHHpKkcMccMqVPU99eATG2zb4n/zAS4OHrV1hIB/AAAAAElFTkSuQmCC',
  carrotDown: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1QQYCRoeq/kCuwAAAB10RVh0Q29tbWVudABDcmVhdGVkIHdpdGggVGhlIEdJTVDvZCVuAAAAmElEQVQY083QMUoDARSE4W92U2xhkxSpAgY0AXMQ29zCM3iSXEXQTrCws44Im85CkO1jnq2KKQWnGxiY+Yd/oXw1tTrr7D86CYdD5Xk3HA8vTi8la7xW1T5Jg8IEN6PvPXnEAkOa5l5Viwuc4yk/d9VyfoLrqnpIMmCGu2z79/wGUsv5FFcYY5Nt/wKjI+BvuEWnbfu///kTargo75QVC5oAAAAASUVORK5CYII=',
  close: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAuJAAALiQE3ycutAAAAB3RJTUUH1QQYCDcSg6d+SAAAAPBJREFUKM+Fkr1qAkEURs9dnWBrJT5IHkEw4gtEsBQs/AlpkiKlJGnEJlqIjRbrPoAQYhPio1hGsPAHFoW5KSIxo7J7qvlgDty534j6Rolgt987OQnA7XuEsTuegwIeMYiIkx2hVnsjCL7+su9/0mz2Lox0oNOpUiw+kc2mUVWGww8mkxYiYK09F4xJMho9kMs9IiJMpy8Y83vFWkUTCVcAWCxWLJcrRIT1OiSTOczuCXieK2y3IeXyK4PBPZtNSKn0zGzWJpW6uvyGer1LpVIgn78GYD7/ptHo0e/fHbemvtHIHv4zvonv4ayXuK9xyg8qt0tfe9qKPAAAAABJRU5ErkJggg=='
};

function isbn10_to_13(isbn) {
    if (!isbn.match(/^([0-9]{9})[0-9xX]$/)) 
        return false;

    // sum the digits with their weights and add the checksum for the 978 prefix
    sum_of_digits = 38 + 3 * (1*isbn[0] + 1*isbn[2] + 1*isbn[4] + 1*isbn[6] + 1*isbn[8]) +
                              1*isbn[1] + 1*isbn[3] + 1*isbn[5] + 1*isbn[7];

    // divide the sum_of_digits by the modulus number (10) to find the remainder
    // and then minus 10 to get the check digit
    check_digit = (10 - (sum_of_digits % 10)) % 10;

    // return isbn with check_digit
    return '978' + isbn.match(/^([0-9]{9})[0-9xX]$/)[1] + check_digit;
}


function quoteRegExp( re )
{
  return re.replace( /([.*+^$?(){}\[\]\\])/g, '\\$1' );
}

function regexpify( stringOrRegExp, flags, quote )
{
  if( (typeof stringOrRegExp == 'function') && stringOrRegExp.exec )
    return stringOrRegExp;
  if( quote ) stringOrRegExp = quoteRegExp( stringOrRegExp );
  return new RegExp( stringOrRegExp, flags );
}

function firstDocumentLinkMatching( re, paren )
{
  var x, i;
  for( i=0; i<document.links.length; i++ )
    if( (x = re.exec( document.links[i].href )) )
      return x[paren]; // should perhaps backtrack up to parent TR, get its
  // previous sibling and verify that its contentText == 'Buy this Book'
}

// AJAX callback returning the first <a href="..."> link to a page whose URL starts with `url'.
// baseURL is prepended to the returned result, so passing "/search?" and "http://example.com"
// might yield a link to "http://example.com/search?isbn=0596000480", if the page contained it.
function firstLinkTo( url, baseURL )
{
  return function( html, http )
  {
    return baseURL + unHTML(html.match( '<a(?:[^>]*) href=["\']?('+ quoteRegExp( url ) +'[^\'" >]*)' )[1]);
  };
}

function nextTagAfter( tag, content )
{
  return function()
  {
    var tags = document.getElementsByTagName( tag ), i, node, isbn;
    for( i=0; i<tags.length; i++ )
      if( tags[i].innerHTML.match( content ) )
	for( j=tags[i].nextSibling; j=j.nextSibling; )
	  if( (isbn = j.textContent.replace( /-/g, '' ).match( /[0-9X]{10}/i )) )
	    return isbn[0];
  };
}

function nextSameTagAfter( tag, content )
{
  return function()
  {
    var isbn, i, tags = document.getElementsByTagName( tag );
    for( i=0; i<tags.length-1; i++ )
      if( tags[i].innerHTML.match( content ) &&
	  (isbn = tags[i+1].innerHTML.match( /[0-9X]{10}/i )) &&
	  (isbn = checkISBN( isbn && isbn[0] )) )
	return isbn;
  };
}

function unHTML( html )
{
  return html.replace( /&(amp|lt|gt|quot|apos|#(\d+));/g, function( match, character, code )
  {
    return { amp:'&', lt:'<', gt:'>', quot:'"', apos:'\'' }[character] || String.fromCharCode( code );
  });
}

function SEK( price ){ return price.replace( /:-|kr| /gi, '' ) +' SEK'; }

// document.getElementById() on steroids (ask for several ids, and you get them back as an array)
function $( ids, doc )
{
  if( typeof ids == 'string' )
    return (doc || document).getElementById( ids );
  for( var i=0; i<ids.length; i++ )
    ids[i] = (doc || document).getElementById( ids[i] );
  return ids;
}

// price cache since last seen book, one day expiry time
var last_isbn = GM_getValue( 'last_isbn', '' );
//GM_setValue( 'last_run', '0' );
var last_run = GM_getValue( 'last_run', '0' );
var last_prices = GM_getValue( 'last_prices', '' );
//alert( 'last_run:'+last_run+'\nsaved:\n\n' + last_prices );

function getPrices( isbn )
{
  var now = (new Date).getTime();
  //alert( isbn +':'+ last_isbn +'\n'+ (now-parseInt( last_run )) +'\n' + last_prices );
  if( (isbn != last_isbn) || (now-parseInt( last_run ) > 36e5) ||
      (last_prices.split( '\n' ).length != handlers.length) ) return false;
  return decodePrices( last_prices );
}

var prices = {};
function updateCache( isbn, store, price )
{
  var now = (new Date).getTime(), got = 0, i, h;
  if( (isbn != last_isbn) || (now - parseInt( last_run ) > 864e5) )
    prices = {};
  last_isbn = isbn;
  last_run = now.toString();
  prices[store] = price;
  for( i in prices ) got++;
  if( got == handlers.length )
  {
    //alert( encodePrices( prices ) );
    GM_setValue( 'last_prices', last_prices = encodePrices( prices ) );
    GM_setValue( 'last_isbn', isbn );
    GM_setValue( 'last_run', last_run );
  }
  else
    ;//alert( got +'/' + handlers.length );
}

function decodePrices( stored )
{
  var prices = {}, i, raw = (stored||'').split( '\n' );
  for( i=0; i<raw.length; i++ )
  {
    var data = raw[i].split( ':' );
    prices[data.shift()] = data.join( ':' );
  }
  return prices;
}

function encodePrices( prices )
{
  var i, raw = [];
  for( i in prices )
    raw.push( i +':'+ prices[i] );
  return raw.join( '\n' );
}

function updatePrices( prices, isbn )
{
  var id, node, price, data, errmsg = 
    'Oops! Either there are no books available,\\n' +
    'or there is a parsing error due to changes\\n' +
    'in to this website\\\'s page format.';
  for( id in prices )
    if( (node = document.getElementById( 'burro_'+id )) )
    {
      if( debug ) GM_log( id +' price set to '+ prices[id] );
      data = (prices[id] || '').split( ':' );
      if( (price = data.shift()) )
      {
	node.firstChild.nodeValue = price;
	if( data.length )
	  updateURL( id, data.join( ':' ) );
      }
      else
	node.innerHTML = '<a style="text-decoration:none;color:#00A;" href="javascript:alert(\''+ errmsg +'\');">none</a>';
      if( isbn )
	updateCache( isbn, id, price );
    }
}

function findHeader( headers, name )
{
  var i, found;
  name = regexpify( name, 'i', 'quote' );
  for( i in headers )
    if( i.match( name ) )
      return headers[i];
}

function runQueries( isbn )
{
  var i, j, h, request, callback, prices = debug ? false : getPrices( isbn );
  if( prices ) return updatePrices( prices ); // already cached
  for( i=0; i<handlers.length; i++ )
  {
    h = handlers[i];
    if( h.ajaxPrice != false )
    {
      if( debug )
	GM_log( h.id +': '+ (h.ajaxMethod||'POST')+'( '+(h.ajaxURL||h.bookURL) + ' )' );
      request = { method:h.ajaxMethod||'POST', data:(h.ajaxData||'').replace( /%s/g, isbn ),
		  onload:makeAjaxCallback( h, isbn ), url:(((h.ajaxURL||h.bookURL).match('%e'))?(h.ajaxURL||h.bookURL).replace( /%e/g, isbn10_to_13(isbn)):(h.ajaxURL||h.bookURL).replace( /%s/g, isbn )) };
      if( h.ajaxHeaders ) request.headers = h.ajaxHeaders;
      if( (request.method == 'POST') && !findHeader( request.headers = request.headers || {}, 'Content-Type' ) )
	request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      GM_xmlhttpRequest( request );
    }
  }
}

function updateURL( id, url )
{
  document.getElementById( 'burro_book_' + id ).href = url;
}

function makeAjaxCallback( handler, isbn )
{
  var callback = handler.ajaxPrice;
  switch( typeof callback )
  {
    case 'function':
      if( !callback.exec )
	break; // callback is already our proper callback
      // fall-through -- it was a regexp:

    case 'string':
      callback = function( html, http )
      {
	var x = html.match( handler.ajaxPrice );
	var price = html.match( handler.ajaxPrice )[1].replace( /&nbsp;/g, '' );
	if( debug > 2 ) GM_log( 'found raw '+ handler.id +'price '+ price );
	if( price ) price = unHTML( price );
	if( price && handler.priceFix ) price = handler.priceFix( price );
	return price;
      };
      break;

    case 'object': // array of string or regexp
      callback = function( html, http )
      {
	var i, price, regexps = handler.ajaxPrice;
	for( i=0; i<regexps.length; i++ )
	  if( (price = html.match( regexps[i] )) )
	  {
	    price = price[1];
	    if( debug > 2 ) GM_log( 'found raw '+ handler.id +' price '+ price +' for regexp '+ regexps[i] );
	    if( price && handler.priceFix ) price = handler.priceFix( price );
	    return price;
	  }
      };
      break;

    default:
      alert( 'Price handler for '+ handler.name +' (id '+ handler.id +
	     ') is of illegal type '+ (typeof callback) +'! Ignoring.' );
      // fall-through:

    case 'boolean':
      callback = function(){};
  }
  return function( xmlHttpResponse )
  {
    if( debug ) with( xmlHttpResponse )
      GM_log( 'Status ' + status+' '+statusText + ': '+ responseText.length +' bytes' );
    var failure = false, prices = {}, result = '', node, id, price;
    try {
      result = callback( xmlHttpResponse.responseText, xmlHttpResponse ) || '';
    } catch (e) {
      failure = true;
      if( debug )
	GM_log( 'Failed to load or parse '+ handler.name +' (id '+ handler.id +'): ' +e );
      //alert( xmlHttpResponse.responseText );
    }
    if( handler.updateURL )
    try {
      var url = handler.updateURL( xmlHttpResponse.responseText, xmlHttpResponse );
      if( url )
	updateURL( handler.id, url );
    } catch( e ) {}
    if( typeof result == 'string' ) // a price tag
    {
      if( url ) result += ':' + url; // a new book URL to link
      prices[handler.id] = result;
    }
    else if( typeof result == 'boolean' ) // availability info only
    {
      if( url ) result += ':' + url; // a new book URL to link
      prices[handler.id] = result ? 'available' : 'unavailable';
    }
    else
      prices = result;
    updatePrices( prices, isbn );
  };
}

function checkEAN( ean )
{
  try {
    ean = (ean||'').replace( /-| |&nbsp;/gi, '' );
    if( ean.length != 13 ) return false;
    var checksum = 0;
    for( var i=0; i<12; i++ )
      checksum += ean.charAt(i) * (i&1 ? 3 : 1);
    checksum = (10 - (checksum % 10)) % 10;
    if( ean.charAt(12) == checksum )
      return ean;
    else
    {
      if( debug ) GM_log( 'EAN '+ean+ ' failed checksum.' );
      return false;
    }
  }
  catch (e)
  { 
    if( debug ) GM_log( 'checkEAN: '+ e );
    return false;
  }
}

function checkISBN( isbn )
{
  try {
    isbn = (isbn||'').toLowerCase().replace( /-| |&nbsp;/g, '' );
    if( isbn.length != 10 ) return false;
    var checksum = 0;
    for( var i=0; i<9; i++ )
      if( isbn.charAt(i) == 'x' )
        checksum += 10 * (i+1);
      else
        checksum += isbn.charAt(i) * (i+1);
    checksum = checksum % 11;
    if( checksum == 10 ) checksum = 'x';
    if( isbn.charAt(9) == checksum )
      return isbn;
    else
    {
      if( debug ) GM_log( 'ISBN '+isbn+ ' failed checksum.' );
      return false;
    }
  }
  catch (e)
  { 
    if( debug ) GM_log( 'checkISBN: '+ e );
    return false;
  }
}

function dom_createLink( url, txt, title, id )
{
  var a  = document.createElement( 'a' );
  if( id ) a.id = id;
  a.setAttribute( 'target', '_top' );
  a.setAttribute( 'href', url );
  with( a.style )
  {
    color = '#00A';
    textDecoration = 'none';
    fontWeight = 'bold';
  }
  if( title ) a.setAttribute( 'title', title );
  a.appendChild( document.createTextNode( txt ) );
  return a;
}

function addSite( url, title, loc_id )
{
  var tr = document.createElement( 'div' );
  var td_left = document.createElement( 'span' );
  var a = dom_createLink( url, title, title+' Search', 'burro_book_'+loc_id );
  td_left.style.paddingLeft = '5px';
  td_left.appendChild( a );
  tr.appendChild( td_left );

  var td_right = document.createElement( 'span' );
  td_right.innerHTML = 'fetching';
  td_right.style.paddingRight = '5px';
  td_right.id = 'burro_' + loc_id;
  tr.appendChild( td_right );

  if( document.all ) // IE only
  {
    tr.style.position = 'relative';
    td_right.style.textAlign = 'right';
    td_right.style.position = 'absolute';
    td_right.style.left = '10em';
    td_right.style.width = '4em';
  }
  else // other browsers
  {
    tr.style.display = 'table-row';
    td_left.style.display = 'table-cell';
    td_right.style.display = 'table-cell';
  }
  return tr;
}

function str2xml( strXML )
{
  if( window.ActiveXObject )
  {
    var domdoc = new ActiveXObject( 'Microsoft.XMLDOM' );
    domdoc.async = 'false';
    domdoc.loadXML( strXML );
    return domdoc;
  }
  else
  {
    var objDOMParser = new DOMParser();
    return objDOMParser.parseFromString( strXML, 'text/xml' );
  }
}

function int2money( cents )
{
  var money = '$'
  if( cents < 100 )
    money = money + '0.';
  else
    money = money + Math.floor( cents/100 ) + '.';
  cents = cents % 100;
  if( cents < 10 )
    money = money + '0';
  money = money + cents;
  return money;
}

var Drag = function(){ this.init.apply( this, arguments ); };

Drag.fixE = function( e )
{
  if( typeof e == 'undefined' ) e = window.event;
  if( typeof e.layerX == 'undefined' ) e.layerX = e.offsetX;
  if( typeof e.layerY == 'undefined' ) e.layerY = e.offsetY;
  return e;
};

Drag.prototype.init = function( handle, dragdiv )
{
  this.div = dragdiv || handle;
  this.handle = handle;
  if( isNaN(parseInt(this.div.style.right )) ) this.div.style.right  = '0px';
  if( isNaN(parseInt(this.div.style.bottom)) ) this.div.style.bottom = '0px';
  this.onDragStart = function(){};
  this.onDragEnd = function(){};
  this.onDrag = function(){};
  this.onClick = function(){};
  this.mouseDown = addEventHandler( this.handle, 'mousedown', this.start, this );
};

Drag.prototype.start = function( e )
{
  // this.mouseUp = addEventHandler( this.handle, 'mouseup', this.end, this );
  e = Drag.fixE( e );
  this.started = new Date();
  var y = this.startY = parseInt(this.div.style.bottom);
  var x = this.startX = parseInt(this.div.style.right);
  this.onDragStart( x, y );
  this.lastMouseX = e.clientX;
  this.lastMouseY = e.clientY;
  this.documentMove = addEventHandler( document, 'mousemove', this.drag, this );
  this.documentStop = addEventHandler( document, 'mouseup', this.end, this );
  if( e.preventDefault ) e.preventDefault();
  return false;
};

Drag.prototype.drag = function( e )
{
  e = Drag.fixE( e );
  var ey = e.clientY;
  var ex = e.clientX;
  var y = parseInt(this.div.style.bottom);
  var x = parseInt(this.div.style.right );
  var nx = x - ex + this.lastMouseX;
  var ny = y - ey + this.lastMouseY;
  this.div.style.right	= nx + 'px';
  this.div.style.bottom	= ny + 'px';
  this.lastMouseX	= ex;
  this.lastMouseY	= ey;
  this.onDrag( nx, ny );
  if( e.preventDefault ) e.preventDefault();
  return false;
};

Drag.prototype.end = function()
{
  removeEventHandler( document, 'mousemove', this.documentMove );
  removeEventHandler( document, 'mouseup', this.documentStop );
  var time = (new Date()) - this.started;
  var x = parseInt(this.div.style.right),  dx = this.startX - x;
  var y = parseInt(this.div.style.bottom), dy = this.startY - y;
  this.onDragEnd( x, y, dx, dy, time );
  if( (dx*dx + dy*dy) < (4*4) && time < 1e3 )
    this.onClick( x, y, dx, dy, time );
};

function removeEventHandler( target, eventName, eventHandler )
{
  if( target.addEventListener )
    target.removeEventListener( eventName, eventHandler, true );
  else if( target.attachEvent )
    target.detachEvent( 'on' + eventName, eventHandler );
}

function addEventHandler( target, eventName, eventHandler, scope )
{
  var f = scope ? function(){ eventHandler.apply( scope, arguments ); } : eventHandler;
  if( target.addEventListener )
    target.addEventListener( eventName, f, true );
  else if( target.attachEvent )
    target.attachEvent( 'on' + eventName, f );
  return f;
}

function burro( location, isbn )
{
  if( debug > 1 ) GM_log( 'adding burro' );
  var handle = document.createElement( 'div' );
  var root = document.createElement( 'div' );
  var box = document.createElement( 'div' ), i, h;
  with( root.style )
  {
    position = 'absolute';
    top = right = '15px';
  }
  handle.style.padding = '4px';
  handle.title = 'Click title to expand, collapse or drag';
  with( box.style )
  {
    position = 'relative';
    zIndex = '1000';

    backgroundColor = '#FFC';
    border = '1px solid orange';
    padding = '0px';
    textAlign = 'left';
    font = '8pt sans-serif';
    width = '220px';
    marginBottom = '15px';

    opacity = '0.93';
    filter = 'alpha(opacity=90)';
  }

  var carrot = document.createElement( 'img' );
  carrot.style.top = '-10px';
  carrot.src = Icons.carrotRight;
  carrot.id = 'hide_show_carrot';
  handle.appendChild( carrot );

  var title_image = document.createElement( 'img' );
  title_image.style.marginLeft = '6px';
  title_image.src = Icons.title;
  handle.appendChild( title_image );

  var close = document.createElement( 'img' );
  close.src = Icons.close;
  with( close.style )
  {
    position = 'absolute';
    right = '3px';
    top = '3px';
    margin = '2px';
    width = '12px';
    height = '12px';
    backgroundColor = '#FFB';
    border = 'none';
    lineHeight = '8px';
    textAlign = 'center';
  }
  close.setAttribute( 'title', 'Click to remove' );
  addEventHandler( close, 'click', function(){ document.body.removeChild( root ); } );
  handle.appendChild( close );

  var about = document.createElement( 'a' );
  var about_img = document.createElement( 'img' );
  about_img.src = Icons.about;
  about_img.style.border = 'none';
  about.appendChild( about_img );
  with( about.style )
  {
    position = 'absolute';
    right = '18px';
    top = '3px';
    margin = '2px';
    width = '12px';
    height = '12px';
    backgroundColor = '#FFB';
    lineHeight = '12px';
    textAlign = 'center';
    textDecoration = 'none';
  }
  about.title = 'OverStimulate / modified by Reify and Johan Sundström';
  about.href = 'http://overstimulate.com/articles/2005/04/24/greasemonkey-book-burro-find-cheap-books';
  handle.appendChild( about );
  box.appendChild( handle );

  var table = document.createElement( 'div' );
  with( table.style )
  {
    marginTop = '1px';
    marginBottom = '3px';
    padding = '0';
    width = '100%';
    font = '10pt sans-serif';
    display = 'none';
  }
  table.id = 'bookburro-pricesTable';
  for( i=0; i<handlers.length; i++ )
  {
    h = handlers[i];
    table.appendChild( addSite( ((h.bookURL.match('%e'))?h.bookURL.replace( /%e/g, isbn10_to_13(isbn)):h.bookURL.replace( /%s/g, isbn )), h.name, h.id ) );
  }
  box.appendChild( table );

  var zip = function()
  {
    box.opened = !box.opened;
    var pricesTable = document.getElementById( 'bookburro-pricesTable' );
    var carrot = document.getElementById( 'hide_show_carrot' );
    if( box.opened ) // pricesTable.style.display == 'none'
    {
      if( !hasFetched ) runQueries( isbn );
      hasFetched = true;
      pricesTable.style.display = document.all ? 'block' : 'table';
      carrot.src = Icons.carrotDown;
    }
    else
    {
      pricesTable.style.display = 'none';
      carrot.src = Icons.carrotRight;
    }
  };
  //addEventHandler( box, 'click', zip );
  root.appendChild( box );
  document.body.appendChild( root );
  handle.drag = new Drag( handle, box );
  handle.drag.onClick = zip;
  if( debug > 1 ) GM_log( 'added burro' );
}

function init()
{
  var i, h, getISBN, isbn;
  for( i=0; i<handlers.length; i++ )
  {
    h = handlers[i];
    if( h.hostname && location.hostname.match( h.hostname ) )
      try {
	if( debug ) GM_log( h.name +' matched at '+ location.hostname );
	getISBN = h.getISBN || /isbn[\/=]([0-9X]{10})(&|\?|\.|$)/i;
	switch( typeof getISBN )
	{
	  case 'string':
	    getISBN = new RegExp( getISBN );
	    // fall-through
	  case 'function':
	    if( getISBN.exec ) // a regexp
	    {
	      var regexp = getISBN;
	      getISBN = function(){ return location.href.match( regexp )[1]; };
	    }
	    isbn = getISBN();
	    break;

	  default:
	    alert( 'getISBN handler for '+ h.name +' (id '+ h.id +
		   ') is of illegal type '+ (typeof getISBN) +'! Ignoring.' );
	    continue;
	}
	if( (isbn = checkISBN( isbn )) )
	  burro( h.id, isbn );
	else if( debug )
	  GM_log( 'Failed to find ISBN for '+ h.name +' (id '+ h.id +')' );
      } catch (e) { if( debug ) GM_log( e ); }
  }
}

// addEventHandler(document, 'load', init);
init();
