(function($){

$.fn.setIndex = function(posIndex) {

	// loop through each tab and enable analytics
	return this.each(function() {

		// get handle to tabs API.
		var api = $(this).data("scrollable");
		alert("DIHDEIO");
		// setup onClick listener for tabs
		api.onClick(function(event, index)  {
			alert("apina");
		});

	});
};

})(jQuery);