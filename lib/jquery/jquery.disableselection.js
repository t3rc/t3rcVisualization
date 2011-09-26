(function($){

	jQuery.fn.extend({ 
        disableSelection : function() { 
                this.each(function() { 
                        this.onselectstart = function() { return false; }; 
                        this.unselectable = "on";
						jQuery(this).css('-moz-user-select', 'none');
                }); 
        } 
	}); 

})(jQuery);