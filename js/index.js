$("#dietSolver").click(function(){
	// slide in left other 2 divs
	// change <a> text and href
});

$("#submitSimplex").click(function(){
	$('#simplex-container').slideUp(400);
	$('#tableau-container').removeClass("animated slideOutDown hidden").addClass("visible");
	$('#tableau-container').slideIn(800);
});

$("#editSimplex").click(function(){
	$('#tableau-container').addClass("animated slideOutDown");
	$('#simplex-container').slideDown(800);
});

$("#addConstraint").click(function(){
	// add html input, +
	// lagyan ng delete?
});
