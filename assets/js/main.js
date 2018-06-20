$(document).ready(function () {
	// Smooth scroll-to code
	$('.learn-more').click(function() {
		$('html, body').animate({
			scrollTop: $('#about').offset().top
		}, 500);
	});

	$('.availability-button').click(function() {
		$('html, body').animate({
			scrollTop: $('#contact').offset().top
		}, 500);
	});
});