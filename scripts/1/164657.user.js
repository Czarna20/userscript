// ==UserScript==
// @name        Ultoo 3 in 1 by Vikram singh Bais
// @namespace  
// @include     http://ultoo.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js
// @grant       none
// @version     15.04.2013
// ==/UserScript==

$(function()
{

var url=window.location.href;

var pattern=/^http:\/\/ultoo.com\/secure.php/g;

if(url.search(pattern)==0)
{
	window.location.href=url.replace("secure","AnswereIt");
}

pattern=/^http:\/\/ultoo.com\/poll.php/g;

if(url.search(pattern)==0)
{
	$("#OptionId_2").attr('checked');
	unsafeWindow.ImplementClass('AnchorId_1');
	document.form1.OptionChecked.value=1;
	document.form1.submit();
	setTimeout("window.location.href = \"http://ultoo.com/poll.php?zxcoiesesscd=\";",100);
}

pattern=/^http:\/\/ultoo.com\/PollResult.php/g;

if(url.search(pattern)==0)
{
	var link = $(".poll_result_gbg a:last").attr('href');
	if(typeof(link) != "undefined")
	{
		window.location.href = link;
	}

	var link2 = $("img[src='images/submit_now.jpg']").parent().attr("href");
	if(typeof(link2) != "undefined")
	{
		window.location.href = link2;
	}
}

pattern=/^http:\/\/ultoo.com\/middleAdPoll.php/g;

if(url.search(pattern)==0)
{
	window.location.href=url.replace("middleAdPoll","poll");
}

pattern=/^http:\/\/ultoo.com\/PollCompletion.php/g;

if(url.search(pattern)==0)
{
	var link = $("img[src='images/submit_now.jpg']").parent().attr("href");
	if(typeof(link) != "undefined")
	{
		window.location.href = link;
	}
}

pattern=/^http:\/\/ultoo.com\/PollCompleted.php/g;

if(url.search(pattern)==0)
{
	if(document.getElementsByTagName('font')[0]!=undefined)
	{
		window.location.href=url.replace("PollCompleted", "index");
	}
	else
	{
		document.getElementsByName('PollUserName')[0].value="Ultoo Guest";
		document.getElementsByName('PollUserQuestion')[0].value="Question'"+Math.floor((Math.random() * 100000000) + 1)+"'";
		document.getElementById('OptionId1').value="a'"+Math.floor((Math.random() * 100) + 1)+"'";
		document.getElementById('OptionId2').value="b'"+Math.floor((Math.random() * 100) + 1)+"'";
		document.getElementById('OptionId3').value="c'"+Math.floor((Math.random() * 100) + 1)+"'";
		document.getElementById('OptionId4').value="d'"+Math.floor((Math.random() * 100) + 1)+"'";
		document.form1.submit();

	}
}

pattern=/^http:\/\/ultoo.com\/QuestionSaved.php/g;

if(url.search(pattern)==0)
{
	window.location.href ="http://ultoo.com/AnswereIt.php?zxcoiesesscd=";
}

//Messages

pattern=/^http:\/\/ultoo.com\/home.php/g;

if(url.search(pattern)==0)
{
	var content=document.getElementsByTagName('font')[0].innerHTML;
	var pat="Dear";

	if(content.search(pat)<0)
	{	
		document.getElementById('MobileNos_').value=8654818096;
                document.getElementById('Message_').value="Hi..., Happy Earning...! my mobile no is'"+Math.floor((Math.random() *9012345678) + 9)+"'";
		document.frmSendSms.submit();
		setTimeout("window.location.href = \"http://ultoo.com/home.php?zxcoiesesscd=\";",100);		
	}
	else
	{
		window.location.href ="http://ultoo.com/poll.php?zxcoiesesscd=";
		//window.location.href ="http://ultoo.com/logout.php?Logout=1";
	}
}

//AnswerIt 

pattern=/^http:\/\/ultoo.com\/AnswereIt.php/g;

if(url.search(pattern)==0)
{
	var options="Watson;Pune;Anita;Dabangg;Rd Burman;Kareena;6;Salman;4;Swahili;Tennis;Veer;Sehwag;Krishna;Mumbai;Shahid;A380;Krish;Kajri;1889;Aasha;Ruble;Snail;Meeta;Accra;Heavily Doped;Vatican;Cool;Yorker;Lamp Filament;Shahrukh;Ganga;Lover;Khushwant;Chile;Fiza;3 Weeks;Dehradun;Pakistan;Abhishek;Red;Ayushmaan;Kukro Koo;Genda;Ajay Vijay;Chess;Rockstar;Hay Tauba;Ears;Carpenter;"
	var quesids="7863;7864;7867;7869;7870;7871;7874;7876;7878;7879;7882;7883;7884;7885;7886;7887;7888;7889;7890;7891;7892;7893;7894;7895;7896;8072;8073;8074;8075;8076;8077;8078;8079;8080;8081;8082;8083;8084;8085;8086;8087;8088;8089;8090;8091;8092;8093;8094;8095;8096";
	var cont=document.getElementsByTagName('p')[0].innerHTML;
	var qno=parseInt(cont.substr(17));
	document.getElementsByTagName('input')[0].value=options.split(";")[qno-1];	
	var quesid=quesids.split(";")[qno-1];
	var oid=(parseInt(quesid)*4)-10;
	var qxval=document.getElementsByTagName('input')[0].value;
	var mobile=9016403905;
	$.post("poll.php",{ qxci:qxval , QuestionId:quesid , OptionChecked:"1" , zxcoiesesscd:"" , chalange_field:"" , response_field:"" , OptionId:oid},function(){});
	setTimeout(function(){$.post("home.php",{zxcoiesesscd:"" , MessageLength:"140" , GlobalKeyValue:"1" , chalange_field:"" , response_field:"" , MobileNos_:mobile , Message_:"Hi..., Happy Earning...! my mobile no is'"+Math.floor((Math.random() *9012345678) + 2)+"'" , SendNow_:"Send Now"}, function(){});},750);
	setTimeout("document.getElementsByTagName('input')[2].click();",100);
	setTimeout("window.location.href = \"http://ultoo.com/AnswereIt.php?zxcoiesesscd=\";",200);
}

pattern=/http:\/\/ultoo.com\/AnswereItGraph.php/g;

if(url.search(pattern)==0)
{
	window.location.href = "http://ultoo.com/AnswereIt.php?zxcoiesesscd=";
}

pattern=/^http:\/\/ultoo.com\/AICompletion.php/g;

if(url.search(pattern)==0)
{
	window.location.href="http://ultoo.com/home.php?zxcoiesesscd=";
}

pattern=/^http:\/\/ultoo.com\/index.php/g;

if(url.search(pattern)==0)
{
	window.location.href="http://ultoo.com/transaction.php?credit=2&debit=0";
}

pattern=/^http:\/\/ultoo.com\/SessExpire.php/g;

if(url.search(pattern)==0)
{
	window.location.href="http://ultoo.com/logout.php?LogOut=1";
}

pattern=/^http:\/\/ultoo.com\/relogin.php/g;

if(url.search(pattern)==0)
{
	window.location.href="http://ultoo.com/login";
}

});

