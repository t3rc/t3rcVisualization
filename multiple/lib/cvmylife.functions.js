// initiate variables
	var longMonths = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
	var months = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
	
	var username = null;
	var password = null;
	
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
	
/*	  function initListing(category, range, off) {
//		update global daterange value
		//setDebugger();
		category = category.toLowerCase();
	  	if (category == "all") {
			
		// remove existing summaries
		$("#summary").children().remove();
		$("#summary").css({
			left: "0px"
		});
		$("#summary").append('<img id="waitanim" src="img/wait.gif" alt="Please wait..." />');
		/*$("#slidemore").css({visibility: "hidden"});
		$("#slideless").css({visibility: "hidden"});
		}
			var ajaxQuery = $.ajax({
				type: "GET",
				url: document.dataURL,
				data: "cat=" + category + "&range=" + document.dateRange + "&off=" + off,
				dataType: ($.browser.msie) ? "text" : "html",
				success:  function(data){
//				check local status, if logged out then empty the returned data string
				if (!document.loginString && !document.logoutSuccess) {
					var xml = "";
          			if ($.browser.msie) {
						xml = new ActiveXObject("Microsoft.XMLDOM");
						xml.async = false;
						xml.loadXML(data);
          			}
          			else {
            			xml = data;
          			}
					submitLogout();
					document.logoutSuccess = true;
				}
				else {
					var xml;
					if ($.browser.msie) {
						xml = new ActiveXObject("Microsoft.XMLDOM");
						xml.async = false;
						xml.loadXML(data);
					}
					else {
						xml = data;
					}
				}
			     if (category == "all")
				 	drawSummary(xml);
				 else
				    drawListing(xml);
			   }
			});
	  }
*/
/*	  function drawSummary(xml){
	  	$("#summaryview").show();
	  	$("#waitanim").remove();
		if ($("#no_data").is(":visible"))
			$("#no_data").fadeOut();
	  	
	  	if ($(xml).find("category").length == 0 && document.loginString) {
			$("#no_data").fadeIn();
			$("#close_secondarea").hide();
	  		return;
	  	}
	  	$("#nodata").remove();
	  	$(xml).find("category").each(function(){
	  		var xmlcategory = $(this).children("name").text();
	  		var xmldata = $(this).children("number").text();
	  		var xmlunit = $(this).children("unit").text();
	  		var xmlactivity = $(this).children("activity").text();
	  		var xmlinfo = $(this).children("info").text();
	  		var summarystring = "";
	  		if (xmlinfo.length > 3) {
	  			// url shortening should be miplemented here
						summarystring = '<span class="summaryinfo">' + xmlinfo + '</span>';
					}
					$("#summary").append('<div id="' + xmlcategory + '" class="summaryitem cat_' + xmlcategory + '"><span class="summarycategory">' + xmlcategory + '</span>' + summarystring + '<div class="summarytitle"><span class="tempvalue">' + xmldata + '</span><div class="number"></div></div><div class="summarydetail">' + xmlunit + '</div><div class="summaryhighlight">&nbsp;</div></div>');
				});
				
				// sort items  
				$("#summary>div").tsort(".tempvalue");
				
				// set summary length for IE (and others as well...)
				$("#summary").css({
					width: ($("#summary .summaryitem").length * 175)
				});
				// show togglesummary
				if ($("#summary .summaryitem").length < 6) {
					// center the summary items, (if less than 6)
					var centerPosition = ($("#summaryview").width() / 2) - $("#summary").width() / 2;
					$("#summary").css({
						left: centerPosition
					});
				}
				// show summaries
				$("#summary").show();
				
				//generate numberdiv
				for (i = 0; i < 10; i++) {
					$(".number").append(i + "<br />");
				}
				
				$(".summarytitle").each(function(){
					var digits = $(this).children(":first").text().length;
					if (digits > 3) {
						$(this).children(":last").css('font-size', '56px')
					}
					for (var i = 1; i < digits; i++) {
						$(this).children(":last").clone().appendTo($(this));
					};
					
					// set padding, clumsy way
					if (digits == 4) {
						$(this).css({
							paddingLeft: 15
						});
					}
					else {
						$(this).css({
							paddingLeft: 20 + (3 - digits) * 20
						});
					}
				});
				
				$(".summarytitle").each(function(){
					$(this).children(".number").each(function(){
						$(this).animate({
							top: -($(this).parent().children(":first").text().charAt($(this).index() - 1) * 80)
						}, 1000);
					});
					
					// show more/less buttons
					
					if ($("#summary .summaryitem").length > 5)
						$("#slidemore").show();
					else {
						$("#slidemore, #slideless").hide();
					}
					
				});
				// initiate tooltips
				$(".summaryitem:has(span.summaryinfo)").tooltip({
					delay: 0,
					tip: "#ttip",
					offset: [-20, 0],
					onBeforeShow: function(){
						$("#ttip>p").text(($(this.getTrigger()).find(".summaryinfo").text()));
					}
				});
				
				// show details if they were already open
				if (document.category != "") {
					$("#" + document.category).each(function(){
						$(this).addClass("selected");
						//overlay the summary
						$("#secondarea").fadeIn();
						redraw({
							range: document.range,
							cat: $(".selected").attr("id")
						});
					});
				}
	 }*/
	 
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
				if ($(xml).find("data").attr("message")){
					ok = true;
					username = $("#user").val();
					password = $("#pass").val();
				}
			}
			else {
				if (xml.indexOf('message="Ok"') != "-1"){
					ok = true;
					username = $("#user").val();
					password = $("#pass").val();
				}
			}
		    if (ok) {
				//resetQuickLogin();
				$("#quicklogin").hide();
				$("#loginwait").hide();
				//$("#login").show();
				$("#calendarcontrols").show();
				$(".buttons").show();
				$(".pointValue").hide();
				var login = $("#user").val();
				// clear the fields
				$("#user").val("");
				$("#pass").val("");
				document.loginString = login;
				$("#logoutscreenlink").show();
				redraw();
				$("#mash-up-map").show();
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

	$("#loginmessage").hide();
	$("#login").hide();
	$("#loginwait").show();
	$.ajax({
		type: "GET",
		url: document.dataURL,
		data: "user=" + $("#user").val() + "&pass=" + $("#pass").val(),
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
				username = "";
				password = "";
				redraw();
				
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


  if (map == null)
    	initializeMashUpMap();

	$.ajax({
		type: "GET",
		url: document.dataURL,
		data: "user="+ username + "&pass=" + password + "&range=" + document.dateRange + "&cat=" + document.selectedCategory,

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
	
	users = {"users":
                    [{ "userid" : "",
                       "location" : 
                            [{ "latLong":""
                            }]
                    }] 
                };
}
	
$(function() {
var heat_button = $("#toggleheatmap").button();
var buttonSets = $("#radio, #Enable_All").buttonset();
//console.debug(document.selectedCategory);
$("#Enable_All").click(function(){
		document.selectedCategory = $(this).val();
		console.debug(document.selectedCategory);
		individual = false;
		redraw();
});

$("#Enable_Individual").click(function(){
		document.selectedCategory = $(this).val();
		console.debug(document.selectedCategory);
		individual = true;
		redraw();
});
});

