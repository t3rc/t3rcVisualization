$(document).ready(function(){

	var map;


	$(".item").live("click", function(){

		displayDetails(this);		

	});

// make listview draggable
	$("#details").draggable({
		axis: "y",
		distance: 10,
		 drag: function(event, ui) {
				var containmentTop = $("#content").offset().top - $("#details").height() + $("#content").height();
		 	if ($("#details").offset().top >= containmentTop) {
				moreItems({range: document.range, cat: $(".selected").attr("id")});
			}
		 },
		 stop: function(event, ui){
		 }
	});

// Date type selection
	$("#dateselect_day,#dateselect_week,#dateselect_month").click(function(){
		// update rangetype selection
		$("#dateselect div").removeClass("dateselect_selected");
		$(this).addClass("dateselect_selected");
		updateCalendarDisplay(this);
	});

// Make summaries selectable
	$(".summaryitem").live("click", function() {
		
		//escape if already selected and summary open, or if no data
		if ($(this).hasClass("selected") && $("#secondarea").css("display") == "block" || $(this).children(":first").children(":first").html() == "0") {
			return;
		}
		
		$(".summaryitem").removeClass("selected");
		$(this).addClass("selected");

		//overlay the summary
		$("#secondarea").fadeIn();

// hide bg graphics and arrows
		$("#expression").fadeOut();
		$("#previous_events").fadeOut();
		$("#next_events").fadeOut();

		document.category = $(".selected").attr("id");
		redraw({range: document.range, cat: $(".selected").attr("id")});
		
		// update detailview to top
			$("#details").css({
				top: 0
			});
			
	});

// initiate summary scrolling
// limit
$("#slidemore").live("click", function() {
	if ($("#slideless").is(":hidden"))
		$("#slideless").fadeIn();
	if ($("#summary").offset().left <= ($("#summaryview").offset().left - $("#summary").outerWidth() + $("#summaryview").outerWidth()) + 171)
		return;
	else {
		$("#summary").animate({
			left: "-=" + ($(".summaryitem").outerWidth() + 10)
		}, 250,function () {
			if ($("#summary").offset().left <= ($("#summaryview").offset().left - $("#summary").outerWidth() + $("#summaryview").outerWidth()) + 171)
				$("#slidemore").fadeOut();
		});
	}
});
$("#slideless").live("click", function() {
if ($("#slidemore").is(":hidden"))
	$("#slidemore").fadeIn();
if ($("#summary").offset().left >= $("#summaryview").offset().left - 170) {
	$("#slideless").fadeOut();
	return;
}
else {
	$("#summary").animate({
		left: "+=" + ($(".summaryitem").outerWidth() + 10)
	}, 250,function () {
			if ($("#summary").offset().left >= $("#summaryview").offset().left - 170)
				$("#slideless").fadeOut();
		});
	}
});

// Apply the newly selected date
$("#choosedate").click(function(){
//	document.secondarea = false;
	$("#datecheck").data("overlay").close();
	setDateRange(document.tempDateRange);
	redraw({range: document.dateRange, cat: "all"});	
});

// handle login
$("#submitlogin").click(function () {
	submitLogin();
});

//handle the mash-up display
$("#btn-mash-up").click(function(){

	displayMashup();
});

//change a cathegory on mash-up page
/*
$("#MashCategories").change(function(){

	showCategoryOnMap();
});
  */




$("#logoutscreenlink").live("click", function() {
submitLogout();
});

// update temporary date range
window.calApi.change(function (event, date){
	setTempDateRange(zokemString(date, document.range));
	setDebugger ();
});

window.calApi.onHide(function () {
	setDebugger;
});

//next and previous timerange

$("#prevrange").click(function () {
		var tempDate = zokemDateObject(document.dateRange);
			switch (document.range) {
			case "d":
				tempDate.setDate(tempDate.getDate() - 1);
				break;
			case "w":
				tempDate.setDate(tempDate.getDate() - 7);
				break;
			case "m":
				tempDate.setDate(1);
				tempDate.setDate(tempDate.getDate() - 1);
				break;
			default:
				break;
		}
	setDateRange(zokemString(tempDate));
	redraw();
});
$("#nextrange").click(function () {
		var tempDate = zokemDateObject(document.dateRange);
			switch (document.range) {
			case "d":
				tempDate.setDate(tempDate.getDate() + 1);
				break;
			case "w":
				tempDate.setDate(tempDate.getDate() + 6);
				break;
			case "m":
				tempDate.setDate(1);
				tempDate.setMonth(tempDate.getMonth() + 2);
				tempDate.setDate(tempDate.getDate() - 1);
				break;
			default:
				break;
		}
	setDateRange(zokemString(tempDate));
	redraw();
});

$(window).resize(function() {
	$("#datecheck").data("tooltip").hide();
	resizeView();
});

// handle password fields and other form inputs

$(".fform_placeholder").focus(function () {
	$(this).next().show();
	$(this).next().focus();
	$(this).hide();
})
$(".fform_password").focusout(function () {
	if ($(this).val() == "") {
		$(this).prev().show();
		$(this).hide();
	}
})
$(".fform_user").focus(function () {
	if ($(this).val() == "Email") $(this).val("");
	$(this).css({color: "#333"});
})
$(".fform_user").focusout(function () {
	if ($(this).val() == "") {
		$(this).css({color: "#999"});
		$(this).val("Email");
	}
})

$('#user,#pass').keyup(function(event) {
  if (event.keyCode == '13') {
	submitLogin();
   }
});

// handle keyboard navigation

	$(document).bind("keydown.scrollable", function(evt) {

		// skip certain conditions
		if (evt.altKey || evt.ctrlKey || $(evt.target).is(":input")) { return; }

		// does this instance have focus?
		//if ( current != self) { return; }

		var key = evt.keyCode;

		if (key == 38 || key == 40) {
			
			var add = (key == 38 ? 0 : 2);
			var scrolladd = (key == 38 ? -1 : 1);
			
			if ($(".item").hasClass("detailselect")) {
				var posIndex = $(".detailselect").index();
				if (posIndex < 1 && key == 38) return;
				updateSelection($(".item:nth-child(" + (posIndex + add) + ")"));

				
			}
			return evt.preventDefault();
		}	  

	}); 
// handle mousewheel
	$(".items").bind("mousewheel", function(event, delta) {
		var containmentTop = $("#content").offset().top + $("#detailclip").height() - $(".items").height();
		var containmentBottom = $("#content").offset().top;
		
		if (($(".items").offset().top > (containmentBottom - 49) && delta == 1) || ($(".items").offset().top > containmentBottom)) {
			$(".items").css({
				top: 0
			});
			return false;			
		};
		if (($(".items").offset().top < (containmentTop + 49) && delta == -1) || ($(".items").offset().top < containmentTop)) {
			$(".items").css({
				top: - ($(".items").height() - $("#content").height())
			});
			return false;			
		};
        var dir = delta > 0 ? 50 : -50,
       	vel = Math.abs(delta);
		var newTop = $(".items").position().top + dir;
		if (newTop >= -($(".items").height() - $("#content").height()) && newTop <= 0) {
			$(".items").css({
				top: newTop
			});
			moreItems({
				range: document.range,
				cat: $(".selected").attr("id")
			});
		}				
    	return false;
    });
	
// Show controls for event scrolling
	$("#details").mouseenter(function () {
	if ($("#secondarea").height() < $("#details").height())
		document.showmoret = setTimeout("$('#previous_events').fadeIn()", 150);
		document.showmoret2 = setTimeout("$('#next_events').fadeIn()", 150);
	});
//	$("#content").mouseleave(function () {
//		clearTimeout(document.showmoret);
//		clearTimeout(document.showmoret2);
//		$("#previous_events").fadeOut();
//		$("#next_events").fadeOut();
//	});
	
//	Close secondarea if close button pressed
	$("#close_secondarea").click(function () {
		$("#secondarea").fadeOut();
		document.category = false;
		$(".agg").hide();
		$("#expression").fadeIn();
		redraw();
	});
	
// Handle next and previous events

	$("#next_events").click(function() {
	var detailHeight = $("#details").height();
	var detailBottom = $("#details").offset().top + detailHeight;
	// is there any point scrolling at all?
	if (detailBottom <= $("#secondarea").offset().top + $("#secondarea").height()) 
		scrollAmount = 0;
	else {
		var detailScrollMax = $(document).height() - detailBottom;
		if (detailScrollMax < $("#secondarea").height()) 
			var scrollAmount = detailScrollMax;
		else 
			var scrollAmount = $("#secondarea").height();
	}
		//alert($("#details").height());
		$("#details").animate({
			top: "-=" + scrollAmount
		}, 200);

	});
	$("#previous_events").click(function() {
	var detailHeight = $("#details").height();
	var detailTop = $("#details").offset().top;
	// is there any point scrolling at all?
//	alert(detailTop);
//	alert($("#secondarea").offset().top);
	if (detailTop >= $("#secondarea").offset().top)
		scrollAmount = 0;
	else {
		var detailScrollMax = detailTop - $("#secondarea").offset().top;
		if (detailScrollMax < $("#secondarea").height()) 
			var scrollAmount = detailScrollMax;
		else 
			var scrollAmount = $("#secondarea").height();
	}
		$("#details").animate({
			top: "-=" + scrollAmount
		}, 200);

	});
	
});
