$(document).ready(function(){

	//$(window).resize(function() {plot});
	$("#btnplaypause").click(togglePlay);
	$("#prevbtn").bind('click', { param: -1}, play);
	$("#nextbtn").bind('click', { param: 1 }, play);
	$("#toggleheatmap").change(toogleHeatMap);
	$("#resetbtn").click(reset);
	initializeMashUpMap();
	initializeTimeplot();

$("#loading").ajaxStart(function(){
   $(this).show();
 });

$("#loading").ajaxStop(function(){
   $(this).hide();
 });
 


// Date type selection
	$("#dateselect_day,#dateselect_week,#dateselect_month").click(function(){
		// update rangetype selection
		$("#dateselect div").removeClass("dateselect_selected");
		$(this).addClass("dateselect_selected");
		updateCalendarDisplay(this);
	});

// Make summaries selectable

// Apply the newly selected date
$("#choosedate").click(function(){
//	document.secondarea = false;
	$("#datecheck").data("overlay").close();
	setDateRange(document.tempDateRange);
	redraw({range: document.dateRange, cat: document.selectedCategory});	
});

// handle login
$("#submitlogin").click(function () {
	submitLogin();
});


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
	
	initJSON();
	
	var tempDate = zokemDateObject(document.dateRange);
	
	switch (document.range) 
	{
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
		
	initJSON();
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
	
});