var mode 	// 1 for maximize, 0 for minimize
var mat = [];	// will contain initial tableau
var tableaus = [];	// will contain collection of tableaus
var vars = [];
var headers = [];
var slack_var = [];
var fx;
var max_iteration = 100;

function simplex(optMode, fxString, constraintsList){
	console.log("Setting up tableau...");
	mode = optMode;
	mat = []
	vars = fxString.replace(/[^a-z]/g, "").split("");

	fx = fxString.replace(/[^a-z0-9\+\-\.\*]/g, "");

	var tableau_var = [];

	for(var i = 0; i < vars.length; i++){
		headers[i] = vars[i];
	}

	for(var i = 0; i < constraintsList.length; i++){
		headers.push("s" + (i+1));
		slack_var[i] = ("s" + (i+1));
		console.log(i + " -> " + constraintsList[i]);
	}

	headers.push("Z", "RHS");

	 constraintsList.forEach(function(part, index, arr){
	 	var slack = 1;
	 	tableau_var = [];
	 	if((arr[index]).indexOf(">") != -1 && mode == 1) slack = -1;
	 	if((arr[index]).indexOf("<") != -1 && mode == 0) slack = -1;
		var str = (arr[index]).replace(/[^a-z0-9\+\-\.\=]/g, "");			// str contains constraint function

		// add variables per constraint
		vars.forEach(function(data){
			var pos = str.indexOf(data);
			var coeff = 0;
			
			if(pos != -1){
				for(var i = pos; i >= 0; i--){
					if(str[i] == '+'){
						coeff = parseFloat(str.substr(i+1, pos-1));
						break;
		  			}
		  			else if(str[i] == '-'){
		  				coeff = 0 - parseFloat(str.substr(i+1, pos-1));
		  				break;
		  			}
		  			else if(i == 0){
						coeff = parseFloat(str.substr(i, pos));
						break;
		  			}
				}
			}

			tableau_var.push(slack * coeff);
		});

		// add RHS
		for(var i = 0; i <= str.length; i++){
			if(str[i] == '='){
				tableau_var.push(slack * parseFloat(str.substr(i+1, str.length)));
				break;
			}
		}
		
		mat.push(tableau_var);
	});

	// add input function to tableau
	fxString = fxString.replace(/[^a-z0-9\+\-\.]/g, "");	// clean input function

	tableau_var = [];

	vars.forEach(function(data){
		var pos = fxString.indexOf(data);
		var coeff = 0;
		
		if(pos != -1){
			for(var i = pos; i >= 0; i--){
				if(fxString[i] == '+'){
					coeff = parseFloat(fxString.substr(i+1, pos-1));
					coeff = coeff ? coeff : 1;
					break;
	  			}
	  			else if(fxString[i] == '-'){
	  				coeff = 0 - parseFloat(fxString.substr(i+1, pos-1));
	  				coeff = coeff ? coeff : -1;
	  				break;
	  			}
	  			else if(i == 0){
					coeff = parseFloat(fxString.substr(i, pos));
					coeff = coeff ? coeff : 1;
					break;
	  			}
			}
		}
		if(mode == 1) tableau_var.push(-coeff);
		else tableau_var.push(coeff);
	});
	
	tableau_var.push(0);
		
	mat.push(tableau_var);
	
	if(mode == 0) transpose();
	else addSlack(); // add slack and Z

	tableaus[0] = mat;

//	showTableau(mat);

	performOps();	// start iteration
}

function performOps(){
	var iterationC = 0;
	var tempMat = [[]];

	var pivotCol_value = Math.min.apply(Math, mat[mat.length - 1]);
	var pivotCol_i = (mat[mat.length - 1]).indexOf(pivotCol_value);

	console.log(mat);

	while(pivotCol_value < 0){
	
	iterationC++;
	if(iterationC > max_iteration){
		alert("Not feasible");
		return;
	}

	tempMat = (tableaus[tableaus.length - 1]).map(function(arr) {
   		return arr.slice();
	});	// create a copy of the prev matrix

	var TR = [];
	var temp = [];

	for(var i = 0; i < tempMat.length; i++){
		if(tempMat[i][(tempMat[i]).length - 1] / tempMat[i][pivotCol_i] <= 0) TR[i] = Infinity;
		else TR[i] = tempMat[i][(tempMat[i]).length - 1] / tempMat[i][pivotCol_i];
	}
	var pivotRow_i = TR.indexOf(Math.min.apply(Math, TR));
	var pivotValue = tempMat[pivotRow_i][pivotCol_i];

	var pivotRow = tempMat[pivotRow_i];
	for(var i = 0; i < pivotRow.length; i++){
		pivotRow[i] = pivotRow[i]/pivotValue;
	}

	for(var j = 0; j < tempMat.length; j++){
		if(j!=pivotRow_i){
			var t = tempMat[j][pivotCol_i];
				for(var i = 0; i < pivotRow.length; i++){
					temp[i] = pivotRow[i] * t;
					tempMat[j][i] = tempMat[j][i] - temp[i];
				}
		}
	}

	tableaus.push(tempMat);

	pivotCol_value = Math.min.apply(Math, tempMat[tempMat.length - 1]);
	pivotCol_i = (tempMat[tempMat.length - 1]).indexOf(pivotCol_value);

	}

	solveProblem(tempMat);
}

function solveProblem(fmat){
	console.log(fmat);

	var var_row = [];

	for(var i = 0; i < fmat[0].length - 1; i++){
		var allZero = 1;
		var oneOne = 0;
		for(var j = 1; j < fmat.length; j++){
			if(fmat[j][i] == 1){
				if(oneOne) oneOne = 0;
				else oneOne = j;
			}
			else if(fmat[j][i] != 0) allZero = 0;
		}
		if(oneOne && allZero) var_row.push(oneOne);
		else var_row.push(-1);
	}

	for(var i = 0; i < vars.length; i++){
		if(var_row[i] != -1){
			window[vars[i]] = fmat[var_row[i]][fmat[0].length-1];
		}
	}

	alert("Z = " + fmat[fmat.length-1][var_row.length]);
}

function addSlack(){
	for(var i = 0; i < mat.length; i++){
		mat[i][headers.length-1] = parseFloat(mat[i][vars.length]);
		for(var j = 0; j < headers.length-1; j++){
      		if(j >= vars.length){
      			if(j-vars.length == i)
	      			mat[i][j] = 1;
	      		else mat[i][j] = 0;
      		}
		}
	}
}

function transpose(){
	
	console.log("Transposing...");

	for(var i = 0; i < mat.length; i++){
		for(var j = 0; j < i; j++){
      		var temp = mat[i][j];
      		mat[i][j] = mat[j][i];
    		mat[j][i] = temp;
		}
	}


	// fix headers
	headers = [];
	for(var i = 0; i < slack_var.length; i++){
		headers.push(slack_var[i]);
	}
	for(var i = 0; i < vars.length; i++){
		headers.push(vars[i]);
	}
	headers.push("Z", "RHS");

	// cut 2d array
	for(var i = 0; i < mat.length; i++){
		if(mat[i][0] === undefined){
			mat.splice(i, 1);
			i--;
   		}
	}

	// add other values
	var temp;
	for(var i = 0; i < mat.length; i++){
		mat[i][headers.length-1] = parseFloat(mat[i][slack_var.length]);
		for(var j = 0; j < headers.length-1; j++){
      		if(j >= slack_var.length){
      			if(j-slack_var.length == i)
	      			mat[i][j] = 1;
	      		else mat[i][j] = 0;
      		}
		}
	}

	// negate last row
	for(var j = 0; j < headers.length-1; j++){
		if(j == headers.length-2) break;
	 	mat[mat.length-1][j] = - mat[mat.length - 1][j];
	}
}