$(document).ready(function(){
	// construct the summaries/details
 	function initXML() {
	      //first we need to load the XML data for that detail row
	      //if the function is a success it will call the function called processDetail
	      $.ajax({
		         type: "GET",
		         url: "menu.xml",
		         dataType: "xml",
		         success: drawSummary
		       });
	      $.ajax({
	         type: "GET",
	         url: "listing.xml",
	         dataType: "xml",
	         success: drawListing
	       });
	  }

	  function drawSummary(xml) {
	      /*$(xml).find("category").each(function()   {
		      alert($(this).attr("name"));
	      });*/
	  }

	  function drawListing(xml) {
	      $(xml).find("event").each(function()   {
		  	var xmlid = $(this).attr("id");
			var xmlname = $(this).find("name").text();
			var xmlduration = $(this).find("duration").text();
			var xmlstart_time = $(this).find("start_time").text();
			var xmllatitude = $(this).find("latitude").text();
			var xmllongitude = $(this).find("longitude").text();
			var xmllocation = $(this).find("location").text();
			var xmldetails = $(this).find("details").text();
		    $("#details").append('<li><div class="detail" id="detail' + xmlid + '"><div class="detailtime"><img src="img/smallicon.png" alt="" /><span>' + xmlstart_time + '</span></div><div class="detailtext">' + xmldetails + '</div></div></li>');
	      });
	  }
	  initXML();
	  
    $('#details').jcarousel({
        vertical: true,
		easing: "linear",
		scroll: 4,
		itemVisibleInCallback: {
 			onBeforeAnimation: itemVisibleInCallbackBeforeAnimation,
  			onAfterAnimation: itemVisibleInCallbackAfterAnimation
		},
		itemLastOutCallback: {
			onBeforeAnimation: itemVisibleInCallbackBeforeAnimation,
			onAfterAnimation: itemVisibleInCallbackAfterAnimation
		},
		itemFirstOutCallback: {
			onBeforeAnimation: itemVisibleInCallbackBeforeAnimation,
			onAfterAnimation: itemVisibleInCallbackAfterAnimation
		}
    });
// fix carousel for chrome
$("#details").height($("#details").innerHeight() + $(".jcarousel-container-vertical").innerHeight());

function itemVisibleInCallbackBeforeAnimation(carousel, item, idx, state) {
    // No animation on first load of the carousel
    if (state == 'init')
        return;
};

function itemVisibleInCallbackAfterAnimation(carousel, item, idx, state) {
	    // No animation on first load of the carousel
    if (state == 'init')
        return;

	if (item.firstChild.id == $(".detailselect").attr("id")) {
		var pos = $(".detailselect").offset();
		$("#selection").css({
			width: "0px",
			"margin-left": ($(".detailselect").innerWidth()) + "px",
			top: pos.top + "px"
		});
		var viewpos = $(".jcarousel-container").offset();
		if (pos.top > viewpos.top && pos.top < (viewpos.top + $(".jcarousel-container").innerHeight())) {
			$("#selection").animate({
				width: "24px"
  			}, 200);
		}

	}
};

// summary expansion
	// unelegantly hide extra elements
	if ($("#summary .summaryitem").length > 5) {
		$("#togglesummaries").show();
	}
	$("#summary .summaryitem").hide();
	$("#summary .summaryitem:lt(5)").show();
	var summaryLimit = 5;
	$('#togglesummaries').toggle(function() {
		$("#summary .summaryitem:gt(" + (summaryLimit - 1) + ")").show();
		$('#togglesummaries').text("Less items");
	}, function() {
		$("#summary .summaryitem:gt(" + (summaryLimit - 1) + ")").hide();
		$('#togglesummaries').text("More items");
	});

	$(".jcarousel-next").click(function(){
		if ($(".jcarousel-next").attr("disabled") == "false" || $(".jcarousel-next").attr("disabled") == 0) {
			$("#selection").hide();
		}
	});
	$(".jcarousel-prev").click(function(){
		if ($(".jcarousel-prev").attr("disabled") == "false" || $(".jcarousel-next").attr("disabled") == 0) {
			$("#selection").hide();
		}
	});
	

// show details
	$(".summaryitem").click(function(){
		$("#secondarea").css({
			visibility: "visible"
		});
	});

// detail selection	
	$(".detail").live("click", function(){
	if ($(this).hasClass("detailselect")) return;
	// display map
		$("#mapplaceholder").hide();
		$("#mapview").show();
		
		// highlight selection
		$(".detail").removeClass("detailselect");
		$(this).addClass("detailselect");
		var pos = $(this).offset();
		$("#selection").css({
			width: "0px",
			"margin-left": ($(this).innerWidth()) + "px",
			top: pos.top + "px"
		});
		$("#selection").show();
		$('#selection').animate({
			width: "24px"
  		}, 200);
	});
	
// handle keyboard navigation in menu

// initiate scrollpanes

	$("#weeks").jScrollPane({
		scrollbarMargin: 0
	});
	$("#months").jScrollPane({
		scrollbarMargin: 0
	});
	$(".jScrollPaneContainer").hide();

// initiate calendar
	$("#calendar").datepicker({
		onSelect: function(dateText, inst){
						$("#dateselect_picker").text(dateText);
     				    $("#calendar").hide();
                    }
	});

// Date type selection
	$("#dateselect_day,#dateselect_week,#dateselect_month").click(function(){
		$(".datehotspot").hide();
		$("#dateselect div").removeClass("dateselect_selected");
		$(this).addClass("dateselect_selected");
		$("#dateselect_picker").text($(this).text());
	});
	
// show datepickers
	$("#dateselect_picker").click(function(){
		var pos = $(this).offset();
		switch ($(".dateselect_selected").attr("id")) {
			case "dateselect_day":
				$(".datehotspot").hide();
				$("#calendar").show();
				$("#calendar").css({
					top: pos.top + 37 + "px",
					left: pos.left + 25 + "px"
				});
				break;
			case "dateselect_week":
				$(".datehotspot").hide();
				$("#weeks").parent().show();
				$("#weeks").parent().css({
					top: pos.top + 37 + "px",
					left: pos.left + 25 + "px"
				});
				break;
			case "dateselect_month":
				$(".datehotspot").hide();
				$("#months").parent().show();
				$("#months").parent().css({
					top: pos.top + 37 + "px",
					left: pos.left + 25 + "px"
				});
				break;
			
		}
	});
	
// datepicker select
	$("#months li,#weeks li").click(function(){
		$("#dateselect_picker").text($(this).text());
        $(".jScrollPaneContainer").hide();
	});

// add datehotspot to specified elements
$(".jScrollPaneContainer, #calendar").addClass("datehotspot");

// Hide all date selectors automatically on mouseout
	$(".datehotspot,#dateselect_picker, ").mouseleave(function(){
    	document.dateTimeout = setTimeout(function() {
        	$(".datehotspot").fadeOut('slow');
		},500);
	});
	
// Clear timeouts on re-enter
	$(".datehotspot,#dateselect_picker, ").mouseenter(function(){
		if ($(".datehotspot").css("opacity") > 0.35) {
			clearTimeout(document.dateTimeout);
			$(".datehotspot").stop();
			$(".datehotspot").fadeTo('slow', 1);
		}
	});
	
	
// add icons to the summaries
// this is temporary
//	$("p").append("");	


	
});