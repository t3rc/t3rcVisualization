// initiate variables
	var longMonths = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
	var months = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
	
	var spotMarker;
	$.tinysort.defaults.order = "desc";

	// start with monday and default to one week of data
	document.weekstart = 2;

	// Set to month to make sure we get something!
	document.range = "m";
	setDateRange(zokemString(new Date()));
	$("#datecheck").text(screenDate(new Date(), "month"));

	// generate zokem style date
	function zokemDate(d) {
		if (!d) {
			d = new Date();
		}
		var zmonth = d.getMonth();
		zmonth++;
		if (zmonth == 13)
			zmonth = 1;
		var zd = d.getFullYear() + "." + zmonth + "." + d.getDate();
		return zd;
	}
	function zokemString(d) {
		if (document.range == "d") {
			d = zokemDate(d);
		}
		else if (document.range == "w")  {
			var day = d.getDay();
			if (day < 1)
				day = 7;
			d.setDate(d.getDate() + (7 - day));
			if (d > new Date()) {
				d = new Date();
			}
			d = zokemDate(d);
		}
		else if (document.range == "m") {
			d.setDate(d.getDate());
			if (d > new Date())
				d = new Date();
			d = zokemDate(d);
		}
		var zstring = document.weekstart + document.range + d;
		return zstring;
	}
	function screenDate(d) {
		if (!d) {
			//alert ("no date given");
			d = new Date();
		}
		var sd;
		if (document.range == "d") {
			d = new Date(d.setMonth(d.getMonth()));
			sd = months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
		}
		else if (document.range == "w")  {
			var day = d.getDay();
			var dstart = new Date(d);
			
			day--;
			if (day == -1)
				day = 6;
				
			dstart.setDate(dstart.getDate() - day);
			sd = months[dstart.getMonth()] + " " + dstart.getDate() + ", " + dstart.getFullYear() + " - " + months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
			
		}
		else if (document.range == "m") {
			
			sd = longMonths[d.getMonth()] + " " + d.getFullYear();
		}
		return sd;
		
	}
	function zokemDateObject(zd) {
		//split the Zokem Date
		var zyear = zd.substring(2,6);
		var zmonth = zd.substring(zd.indexOf(".") + 1,zd.lastIndexOf("."));
		zmonth--;
		if (zmonth < 0)
			zmonth = 11;
		var zday = zd.substring(zd.lastIndexOf(".") + 1);
		// get selected day - which is the fisrt of the selected range
		var nd;
		switch (document.range) {
			case "d":
				nd = new Date(zyear, zmonth, zday);
				break;
			case "w":
				nd = new Date(zyear, zmonth, zday);
				break;
			case "m":
				nd = new Date(zyear, zmonth);
				break;
			default:
				break;
		}
		return nd;
	}
	6
//////////////////////////////////////////////////////////////
//	redraw(arg)												//
//////////////////////////////////////////////////////////////
//	The main loop of querying and displaying information	//
//	Category and range can be given as arguments			//
//	the "off" number is not supported currently				//
//////////////////////////////////////////////////////////////
	function redraw(arg) {
	
	$("#datecheck").text(screenDate(zokemDateObject(document.dateRange)));
		// default arguments
		if (!arg) {
			var range = document.range;
			var cat = document.selectedCategory;
		}
		else {
			var range = arg.range;
			var cat = arg.cat;
		}
		showCategoryOnMap();
		
	}
	 
	 function elapsed (t) {
	 	t = t.substr(4);
		var year = t.substr(t.lastIndexOf(" "));
	 	t = t.substr(0,t.lastIndexOf(" "));
	 	t = t.substr(0,t.lastIndexOf(" "));
		var time = t.substr(t.lastIndexOf(" "));
	 	t = t.substr(0,t.lastIndexOf(" "));
		t = t + " " + year + " " + time;
	 	var then = new Date(t);
		var now = new Date();
		var time = now.getTime() - then.getTime();
		//choose to display in seconds, minutes, hours or days.
		if (time < 60000)
			time = Math.round(time / 1000) + " seconds ago" ;
		else if (time < 3600000)
			time = Math.round(time / 60000) + " minutes ago" ;
		else if (time < 86400000)
			time = Math.round(time / 3600000) + " hours ago" ;
		else if (time < 86400000 * 3)
			time = Math.round(time / 86400000) + " days ago" ;
		else
			time = then.format("default");
	 	return time;
	 }
	 
	 function drawListing(xml) {
	 	
		// this happens when we have logged out CLOSE THE OVERLAY OF DETAILS IF NECESSARY!	
		if ($(xml).find("category").length==0)
	        return;
		document.template = new Array();
		// template ID not read, assumed to be in order starting from 1
		$(xml).find("template").each(function()   {
			document.template.push($(this).text())
		});
	    $(xml).find("event").each(function() {
			var xmlname = $(this).children("name").text();
			var xmlstart_time = $(this).children("starttime").text();
			var dateString = elapsed(xmlstart_time);
			var xmllatitude = $(this).children("latitude").text();
			var xmllongitude = $(this).children("longitude").text();
			var xmladdress = $(this).children("address").text();
			
			// Template handling
			// Minus one because template id's start from 1, Array contents from 0
			var templateNumber = parseInt($(this).attr("template")) - 1;
			var detailString = document.template[templateNumber];
			$(this).children("customvalue").each(function () {
				if (detailString) // I'm not sure why this is required
					detailString = detailString.replace("{" + $(this).attr("name") + "}", "<span class='var'>" + $(this).attr("value") + "</span>");
			});
			// clean up the name string, if web address
			if (xmlname.indexOf("http://") != -1) {
				xmlname = xmlname.substring(7);
				xmlname = xmlname.substring(0, xmlname.indexOf("/"));
			}
			$("#details").append('<div class="item" id="detail_' + xmlname + '"><span class="address">' + xmladdress + '</span><span class="coordinates_lat">' + xmllatitude + '</span><span class="coordinates_lng">' + xmllongitude + '</span><div class="detailtext">' + xmlname + ' ' + detailString + '</div><div class="detailtime">' + dateString + '</div></div>');
		});
			
			// disable scroll if less than ten elements
			if ($(".item").length < 10) 
				$("#details").draggable("option", "disabled", true);
			else {
				$("#details").draggable("option", "disabled", false);
				moreItems({range: document.range, cat: $(".selected").attr("id")});
				updateDetailViewLimits();
			}
	 }

// update detailview mouse limits
function updateDetailViewLimits () {
	var containmentTop = $("#content").offset().top - $("#details").height() + $("#content").height() - 50;
	var containmentBottom = $("#content").offset().top;
	$("#details").draggable("option", "containment", [0, containmentTop, 0, containmentBottom]);
}

// detail selection	
function updateSelection(e){
	if ($(e).hasClass("detailselect")) 
		return;
	
	// enable/disable scrollbuttons
	
	
	// highlight selection
	$(".item").removeClass("detailselect");
	$(e).addClass("detailselect");
}

	function handleLogin(xml) {
			var ok = false;
			if ($.browser.msie) {
				if ($(xml).find("data").attr("message"))
					ok = true;
			}
			else {
				if (xml.indexOf('message="Ok"') != "-1")
					ok = true;
			}
		    if (ok) {
				//resetQuickLogin();
				$("#quicklogin").hide();
				$("#loginwait").hide();
				//$("#login").show();
				$("#calendarcontrols").show();
				$(".buttons").show();
				console.log("aj");
				$(".pointValue").hide();
				var login = $("#user").val();
				// clear the fields
				$("#user").val("");
				$("#pass").val("");
				document.loginString = login;
		
				$("#logoutscreenlink").show();
				//$("#settings_link").show();
				redraw();
				$("#mash-up-map").show();
				$("#player").show();
				return;
			}
			else{
				$("#login").show();
				$("#loginwait").hide();
				$("#submitlogin").show();
				var login = false;
				$("#loginmessage").fadeIn();
				
	}
	}

// ajax load more items
function moreItems(arg) {
			var range = arg.range;
			var cat = arg.cat;
			var off = $(".item").length;
	
		    initListing(cat, range, off);
}

function submitLogin () {

//alert($("#pass").val());

	$("#loginmessage").hide();
	$("#login").hide();
	$("#loginwait").show();
	$.ajax({
		type: "GET",
		url: document.dataURL,
		data: "user=" + $("#user").val() + "&pass=" + $.sha1($("#pass").val()),
		dataType: ($.browser.msie) ? "text" : "html",
		success:  function(data){
		     var xml;
		     if ($.browser.msie) {
			 	xml = new ActiveXObject("Microsoft.XMLDOM");
		     	xml.async = false;
		     	xml.loadXML(data);
		     } else {
		     	xml = data;
		     }
			document.logoutSuccess = false;
	     	handleLogin(xml);
	   }
	});
}

function checkLoginStatus() {
		$.ajax({
		type: "GET",
		url: document.settingsURL,
		dataType: ($.browser.msie) ? "text" : "html",
		success:  function(data){
		     var xml;
		     if ($.browser.msie) {
			 	xml = new ActiveXObject("Microsoft.XMLDOM");
		     	xml.async = false;
		     	xml.loadXML(data);
		     } else {
		     	xml = data;
		     }
			 	if (data.indexOf(' message="Login failed"') != -1)
					document.loginString = false;
				else
					document.loginString = true;
			 	initLoginStatus();
		   }
		});
}

function submitLogout () {
		$("#logoutscreenlink").hide();
		$.ajax({
			type: "GET",
			url: document.dataURL,
			data: "logout",
			dataType: ($.browser.msie) ? "text" : "html",
			success:  function(data){
				document.loginString = false;
				$("#calendarcontrols").hide();
				$("#settings_link").hide();
				$("#quicklogin").fadeIn();
				$(".pointValue").hide();
//				$("#player").hide();
				$("#login").fadeIn();
				resetQuickLogin();
				redraw();
				$("#infoBox").html("");
		   }
		});
}

function initLoginStatus() {
	if (document.loginString == true) {
		$("#logoutscreenlink").show();
		$("#loginmessage").hide();
		populateSettings();
		$("#introtext").hide();
		$(".pointValue").hide();
		$("#settings_link").show();
		redraw();
		initScreen();	
	}
	else{
		$("#logoutscreenlink").hide();
		$("#loginmessage").hide();
		$("#settings_link").hide();
	}
}

function updateCalendarDisplay(el) {
		if ($(el).text() == "Day") {
			var tempdate = zokemDateObject(document.tempDateRange);
			if (document.range == "m")
				tempdate.setMonth(tempdate.getMonth());
			document.range = "d";
			setTempDateRange(zokemString(tempdate, document.range));
			setDebugger();
			window.calApi.hide();
			window.calApi.day();
			window.calApi.setMax(new Date());
			window.calApi.show();
		}
		if ($(el).text() == "Week") {
			document.range = "w";
			window.calApi.hide();
			window.calApi.week();
			window.calApi.show();
			var tempdate = zokemDateObject(document.tempDateRange);
			setTempDateRange(zokemString(tempdate, document.range));
			setDebugger();
		}
		if ($(el).text() == "Month") {
			document.range = "m";
			window.calApi.hide();
			window.calApi.month();
			window.calApi.show();
			var tempdate = zokemDateObject(document.tempDateRange);
			tempdate.setMonth(tempdate.getMonth() + 1);
			tempdate.setDate(tempdate.getDate() - 1);
			setTempDateRange(zokemString(tempdate, document.range));
			setDebugger();
			$("input.date").val(screenDate(zokemDateObject(document.dateRange)));
		}
}

function setDateRange (r) {
	document.dateRange = r;
	document.tempDateRange = document.dateRange;
	// update debugger
	setDebugger();
}

function setTempDateRange (r) {
	document.tempDateRange = r;
	// update debugger
	setDebugger();
}

function setDebugger () {
//	$("#debug_daterange").text(document.dateRange);
//	$("#debug_temprange").text(document.tempDateRange);
}

function showTooltips() {
	$('#datecheck').data('tooltip').show();
	var datetooltiptimer = setTimeout("$('#datecheck').data('tooltip').hide();", 5000);
}

function initScreen () {
	//show login as default, say hello to the anonymous user. This is not run in the startup load, please check!
	if (document.loginString == true) {
		// hide login, show dateselect
		$("#quicklogin").hide();
		$("#calendarcontrols").show();
		if ($(".buttons").css("display")=="none"){
			$(".buttons").show();
		};
	}	
}



function renderForms() {
	$("input[type=text]").wrap("<div class='inputwrapper' />");
	$(".fform_placeholder").after('<input type="password" name="pass" id="pass" value="" class="fform_password" tabindex="2" />');
}

function resetQuickLogin() {
	$('#pass').val("");
	$('#user').val("Email");
	$('#user').css({color: "#999"});
	$("#pass").hide();
	$("#passplaceholder").show();
}

function resizeView() {
	$("#content").height($(window).height() - 300);
}

	function populateSettings () {
		$.ajax({
			type: "GET",
			url: document.settingsURL,
			dataType: ($.browser.msie) ? "text" : "html",
			success:  function(data){
			     var xml;
			     if ($.browser.msie) {
				 	  xml = new ActiveXObject("Microsoft.XMLDOM");
			     	xml.async = false;
			     	xml.loadXML(data);
			     } else {
			     	xml = data;
			     }
//				 alert(data);
           $("#settings").append(data);
					//set action
					$("#settings").find("form").attr("id", "settingsform");
					$("#settings").find("form").attr("action", "http://smartmob.zokem.com/mylife/settings");
					$("#settingsform").submit(function(){
						$.ajax({  
				             type: "POST",  
				             url: "/mylife/settings",  
				             data: $("#settingsform").serialize(),  
				             success: function(data) {
							   if (data.indexOf("Authentication failed") != -1) {
							   	alert("Please insert old password.");
								$("#settings").find("tr:not(.settings_titlerow)").hide();
								$("#settings").find("tr.settings_titlerow:first").next().show();
								return false;
							   }
				               alert("Settings updated."); 
				               $("#settings").empty();
				               populateSettings();
           					   window.settingsOverlayApi.close(); 
				             }  
           			});
            			return false;
					});
	    // Style the settings headers
	    $("#settings").find("td[colspan='2']").addClass("settings_title").append("&nbsp;&raquo;");
		// add classes to title rows
		$("#settings").find("td[colspan='2']").parent().addClass("settings_titlerow");
		// hide items
		$("#settings").find("tr:not(.settings_titlerow)").hide();
		$(".settings_titlerow").click(function () {
			if ($(this).next().is(":visible")) 
				$("#settings").find("tr:not(.settings_titlerow)").hide();
			else {
				$("#settings").find("tr:not(.settings_titlerow)").hide();
				$(this).nextUntil(".settings_titlerow").show();
			}
		});
		}
		});
	}

function showCategoryOnMap(){

console.log("selecte category: " + document.selectedCategory);

  if (map == null)
    	initializeMashUpMap();

// if it is calling all categories or just location category
// which have different response struncture then call AJAX API again
// otherwise just filter the existing one
if (document.selectedCategory == "allevents")
{
	$.ajax({
		type: "GET",
		url: document.dataURL,
		//data: "off=-1&cat=" + $("#MashCategories").val() + "&range=" + document.dateRange,
		//data: "off=-1&cat=" + document.selectedCategory + "&range=" + document.dateRange,
		data: "off=-1&cat=" + document.selectedCategory + "&range=" + document.dateRange,

		dataType: ($.browser.msie) ? "text" : "html",
		success:  function(data){
		     var xml;
		     if ($.browser.msie) {
			 	xml = new ActiveXObject("Microsoft.XMLDOM");
		     	xml.async = false;
		     	xml.loadXML(data);
		     } else {
		     	xml = data;
		     }
			
	     	addMarkersFromXML(xml);
	     	
	     	if( !$('#location-mash-up').is(':visible') ){
	     	     $('#location-mash-up').show();
	     	}
	     	
	   }
	});

}
else
{
    //filter existing object
    filter_events(document.selectedCategory);

}	

}

function initJSON(){
	_object = {"dates":
	[{	"date":"",
		"category":[{
			"name":"",
			"_event":
				[{
					"latLong":"",
					"htmlString":"",
					"dateEvent":"",
				}],
			"num_evt":0,
		}]	
	}]
	};
}

	
$(function() {
var heat_button = $("#toggleheatmap").button();
var buttonSets = $("#radio, #Enable_All, #Enable_Location, #Enable_Application, #Enable_Browsing, #Enable_Messaging, #Enable_Phone").buttonset();
//console.debug(document.selectedCategory);
//console.debug($("#Enable_All").val());
$("#Enable_All").click(function(){
		document.selectedCategory = $(this).val();
		console.debug(document.selectedCategory);
		redraw();
});

$("#Enable_Location").click(function(){
		document.selectedCategory = $(this).val();
		console.debug(document.selectedCategory);
		redraw();
});

$("#Enable_Application").click(function(){
		document.selectedCategory = $(this).val();
		console.debug(document.selectedCategory);
		redraw();
});

$("#Enable_Browsing").click(function(){
		document.selectedCategory = $(this).val();
		console.debug(document.selectedCategory);
		redraw();
});

$("#Enable_Messaging").click(function(){
		document.selectedCategory = $(this).val();
		console.debug(document.selectedCategory);
		redraw();
});

$("#Enable_Phone").click(function(){
		document.selectedCategory = $(this).val();
		console.debug(document.selectedCategory);
		redraw();
});

$("#Enable_Calendar").click(function(){
		document.selectedCategory = $(this).val();
		console.debug(document.selectedCategory);
		redraw();
});

});
