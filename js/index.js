$("#submitSimplex").click(function(){
	var optMode = $('#opt_mode').prop('checked')? 1 : 0;
	var fxString = $('#inputFx').val();
	var constraintsList = []

	var numConstraints = parseInt($(".constraint:last").attr('id').replace( /^\D+/g, ''));

	for(var i = 1; i <= numConstraints;i++){
		constraintsList[i] = $('#constraint-' + i).val();
	}


	simplex(optMode, fxString, constraintsList);

	$('#simplex-container').slideUp(400);
	$('#tableau-container').removeClass("animated slideOutDown hidden").addClass("visible");
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
});
