$(document).ready(function(){

// Date type selection
	$("#dateselect_day,#dateselect_week,#dateselect_month").click(function(){
		// update rangetype selection
		$("#dateselect div").removeClass("dateselect_selected");
		$(this).addClass("dateselect_selected");
		updateCalendarDisplay(this);
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

$("#MashCategories").change(function(){

	showCategoryOnMap();
});





$("#logoutscreenlink").live("click", function() {
submitLogout();
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
/*
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
*/
	

	
});
