var curr = 0;

$("#submitSimplex").click(function(){

	var optMode = $('#opt_mode').prop('checked')? 1 : 0;
	var fxString = $('#inputFx').val();
	var constraintsList = [];

	var numConstraints = parseInt($(".constraint:last").attr('id').replace( /^\D+/g, ''));

	for(var i = 1; i <= numConstraints;i++){
		constraintsList[i] = $('#constraint-' + i).val();
	}


//	var optMode = 0;
//	var fxString = "W = 1*a + 1*b + 1*c"
//	var constraintsList = ["1*a + 2*b + c >= 30", "0*a + 6*b + c <= 54", "1*a + 1*b + 2*c >= 20"];
	
//	var fxString = "W = 1*a + 0.5*b + 2.5*c + 3*d"
//	var constraintsList = ["1.5*a + 1*b + 2*d >= 35", "2*b + 6*c + 4*d >= 120", "1*a + 1*b + 1*c + 1*d >= 50", "0.5*a + 2.5*c + 1.5*d >= 75"];

//	 var optMode = 1;
//	 var fxString = "Z = 150r + 175p";
//	 var constraintsList = ["7r + 11p <= 77", "10r + 8p <= 80", "1r <= 9", "1p <= 6"];


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
	// add html input for constraints
	var num = parseInt($(".constraint:last").attr('id').replace( /^\D+/g, '')) + 1; // get num of last constraint then add 1
	var nc = "<input type='text' placeholder='a, b, c, d >= 0' class='constraint' id='constraint-"
	+ num + "'>";
	$(nc).appendTo($("#constraints-list"));
});

$("#next-tableau").click(function(){
	curr = parseInt($('#current-tableau').html());
	if(curr < tableaus.length - 1){
		curr++;
		$('#tableau').html("");
		showTableau(tableaus[curr]);
		$('#current-tableau').html(curr);
	}
});

$("#prev-tableau").click(function(){
	curr = parseInt($('#current-tableau').html());
	if(curr){
		curr--;
		$('#tableau').html("");
		showTableau(tableaus[curr]);
		$('#current-tableau').html(curr);
	}
});

function showTableau(mat){
	var content = "";
	var row;

	// add html content

	content += "<thead><tr>"
	for(var j = 0; j < headers.length; j++){
			content += "<td>" + headers[j] + "</td>"
	}
	content += "</tr></thead>"

	content += "<tbody>"
	for(var i = 0; i < mat.length; i++){
		content += "<tr>"
		row = mat[i];
		for(var j = 0; j < row.length; j++){
			content += "<td>" + parseFloat((row[j]).toFixed(4)) + "</td>"
		}
		content += "</tr>"
	}
	content += "</tbody>"

	$(content).appendTo($("#tableau"));
	if(solxns[curr*3 + 0] !== undefined)
		$('#solutions').html("Pivot Row: " + solxns[curr*3 + 0] + " | Pivot Column: " + solxns[curr*3 + 1] + " | Pivot Value: " + solxns[curr*3 + 2]);
	else{
		var content = "";
		console.log(var_row);
		if(var_row_bool){
			for(var i = 0; i < vars.length; i++){
				if(var_row[i] != -1){
					content += " | " + vars[i] + " = " + parseFloat((final[var_row[i]][final[0].length-1]).toFixed(4)) + " ";
					console.log(var_row[i]);
				}
			}
			$('#solutions').html("Z = " + parseFloat(z.toFixed(4)) + " " + content);
		}
	}
}