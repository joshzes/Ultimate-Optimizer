$("#changeProb").click(function(){
	
	
	if($('h4').html() == "Ultimate Optimizer"){
		// slide in left other 2 divs
		$('h4').html("Diet Problem Solver");
		$('#changeProb').html("<a href='#' class='hvr-underline-from-left' id='ultimateOpt'>[ Go To Ultimate Optimizer ]</a>");
		$('body').css("background-color", "#ffbfd8");

		$('#simplex-container').hide("slide", {direction: "left"}, 500);
		$('#simplex-container').addClass("animated fadeOutLeft");
		$('#diet-container').removeClass("hidden animated slideInLeft");
		$('#diet-container').addClass("animated fadeInRightBig");
	}

	else{
		// slide in right 2 divs
		$('h4').html("Ultimate Optimizer");
		$('#changeProb').html("<a href='#' class='hvr-underline-from-left' id='dietSolver'>[ Go To Diet Problem Solver ]</a>");
		$('body').css("background-color", "#C7EDE4");
	}
});

$("#submitSimplex").click(function(){
	$('#simplex-container').slideUp(400);
	$('#tableau-container').removeClass("animated slideOutDown hidden").addClass("visible");
	$('#tableau-container').slideIn(1000);
});

$("#editSimplex").click(function(){
	$('#tableau-container').addClass("animated slideOutDown");
	$('#simplex-container').slideDown(800);
});

$("#addConstraint").click(function(){
	var num = parseInt($(".constraint:last").attr('id').replace( /^\D+/g, '')) + 1; // get num of last constraint then add 1
	var nc = "<input type='text' placeholder='a, b, c, d >= 0' class='constraint' id='constraint-"
	+ num + "'>";
	$(nc).appendTo($("#constraints-list"));
	// lagyan ng delete?
});
