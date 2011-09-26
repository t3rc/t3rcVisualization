$(document).ready(function(){
	
// does this need to be here and not in the functions.js?	
$("#login").submit(function () {
	submitLogin();
	return false;
});
	document.category = "";
  document.zoom = 13;
	document.loginString = false;
	document.logoutSuccess = false;
	checkLoginStatus();
	resizeView();
	
// initiate list view

	$("#detailcontainer").scrollable({ 
		vertical: true,
		mousewheel: false,
		keyboard: false
	});

	// initiate detailcontainer API
	var api = $("#detailcontainer").data("scrollable");

	// initialize Calendar
	$(":date").dateinput({
		firstDay: 1,
		format: "mmmm dd, yyyy",
		min: "2009-1-1",
		max: 7 - new Date().getDay(),
		month: true
	});

	// set calendar input to display month as default
	$(":input.date").val(screenDate(new Date(), "month"));
	
	// initialize Calendar API
	window.calApi = $(":date").data("dateinput");

	// style forms
    renderForms();

	// hide the overlay elements by default
    $("#prefs").hide();
    $("#loginscreen").hide();
    $("#dateselect").hide();
	
	// initiate overlays
	$("#datecheck").overlay({
		mask: {
			color: '#fff',
			loadSpeed: 200,
			opacity: 0.6
		},
		top: "100px",
		left: "50%",
		fixed: false
	});
	$("#introtext .link").overlay({
		mask: {
			color: '#fff',
			loadSpeed: 200,
			opacity: 0.6
		},
		top: "100px",
		left: "50%",
		fixed: false
	});
	
	// initialize overlay APIs
	var datecheckOverlayApi = $("#datecheck").data("overlay");

	// The following are required in order to keep keyboard functionality. The calendar blocks keyboard use, so the calendar is destroyed while the calendar overlay is hidden, and created again when the overlay is shown.
	datecheckOverlayApi.onLoad(function(){
		window.calApi.show();
	});
	datecheckOverlayApi.onClose(function(){
		window.calApi.hide();
	});

	// disable selection of all elements
	$("body").disableSelection();

	// set tooltips, change the way the text is changed, this is overhead causing
	$("#datecheck").tooltip({
		tip: "#ttip_date",
		effect: "slide",
		position: "bottom center",
		offset: [20, 0],
		predelay: 500,
		onHide: function () {
			$("#ttip_date>p").text("Click here to select date range!");
		}
	});

	
//	resizeClipView();
	
	//add png fade support to selected elements -- at this stage this is done by hand, but there is potential for automation here.
	
	if ($.browser.msie) {
		$("img[src$='png']").css({
			filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='img/nano.png', sizingMethod='scale')"
		});
		$("#loginscreen, #helpscreen, #prefs").css({
			background: "#eee"
		});
	}

// Create overlay for settings
	$("body").append("<div id='settings'></div>");

	$("#settings_link").overlay({
		mask: {
			color: '#fff',
			loadSpeed: 200,
			opacity: 0.6
		},
		top: "100px",
		left: "50%",
		fixed: false
	});
	
	// initialize settings overlay API
	window.settingsOverlayApi = $("#settings_link").data("overlay");
	
// Create overlay for "show more" and "show less"
	$("#secondarea").append("<img id='previous_events' src='img/slideless_v.png' />");
	$("#secondarea").append("<img id='next_events' src='img/slidemore_v.png' />");
	
// Create overlay for "No data found"
	$("body").append("<div id='no_data'>No data available for selected time range!</div>");

// Create close button for secondarea
	$("#secondarea").append("<img id='close_secondarea' src='img/close.png' alt='Close' />");

});