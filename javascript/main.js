(function() {
  $(document).ready(function() {
		mainNavToggle();
    showWorkInfo();
	});

	function mainNavToggle() {
		$('#nav-toggle').click(function() {
			$('.main-nav-ul').toggleClass('show');
		});
	}

	function showWorkInfo() {
	  var workInfo = $('#work-accordion');
	  workInfo.find('.work-info').hide();
	  workInfo.find('.show-work-info').click(function() {
		  var next = $(this).next();
		  next.slideToggle('fast');
		  $('.work-info').not(next).slideUp('fast');
		  return false;
	  });
	}
})();