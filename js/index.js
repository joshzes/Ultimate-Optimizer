$("#submitSimplex").click(function(){
/*
	var optMode = $('#opt_mode').prop('checked')? 1 : 0;
	var fxString = $('#inputFx').val();
	var constraintsList = [];

	var numConstraints = parseInt($(".constraint:last").attr('id').replace( /^\D+/g, ''));

	for(var i = 1; i <= numConstraints;i++){
		constraintsList[i] = $('#constraint-' + i).val();
	}
*/

	var optMode = 1;
	var fxString = "Z = 150r + 175p"
	var constraintsList = ["7r + 11p <= 77", "10r + 8p <= 80", "r <= 9", "p <= 6"];
	simplex(optMode, fxString, constraintsList);

	showTableau(mat);

	$('#simplex-container').slideUp(400);
	$('#tableau-container').removeClass("animated slideOutDown hidden").addClass("visible");
});

$("#editSimplex").click(function(){
	$('#tableau-container').addClass("animated slideOutDown");
	$('#simplex-container').slideDown(800);
	$('#tableau').html("");

});

$("#addConstraint").click(function(){
	var num = parseInt($(".constraint:last").attr('id').replace( /^\D+/g, '')) + 1; // get num of last constraint then add 1
	var nc = "<input type='text' placeholder='a, b, c, d >= 0' class='constraint' id='constraint-"
	+ num + "'>";
	$(nc).appendTo($("#constraints-list"));
});

$("#next-tableau").click(function(){
	var curr = parseInt($('#current-tableau').html());
	if(curr < tableaus.length - 1){
		$('#tableau').html("");
		showTableau(tableaus[curr + 1]);
		$('#current-tableau').html(curr+1);
	}
});

$("#prev-tableau").click(function(){
	var curr = parseInt($('#current-tableau').html());
	if(curr){
		$('#tableau').html("");
		showTableau(tableaus[curr-1]);
		$('#current-tableau').html(curr-1);
	}
});

function showTableau(mat){
	var content = "";
	var row;

	content += "<thead><tr>"
	for(var j = 0; j < (mat[0]).length; j++){
			content += "<td>" + mat[0][j] + "</td>"
	}
	content += "</tr></thead>"

	content += "<tbody>"
	for(var i = 1; i < mat.length; i++){
		content += "<tr>"
		row = mat[i];
		for(var j = 0; j < row.length; j++){
			content += "<td>" + parseFloat((row[j]).toFixed(4)) + "</td>"
		}
		content += "</tr>"
	}
	content += "</tbody>"

	$(content).appendTo($("#tableau"));
}