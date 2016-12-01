var mode 	// 1 for maximize, 0 for minimize
var mat = [];	// will contain initial tableau
var tableaus = [];	// will contain collection of tableaus
var vars = [];
var slack_var = [];
var fx;

function simplex(optMode, fxString, constraintsList){
	console.log("Setting up tableau...");
	mode = optMode;
	mat = []
	vars = fxString.replace(/[^a-z]/g, "").split("");

	fx = fxString.replace(/[^a-z0-9\+\-\.\*]/g, "");

	var tableau_var = [];

	for(var i = 0; i < vars.length; i++){
		tableau_var[i] = vars[i];
	}

	for(var i = 0; i < constraintsList.length; i++){
		tableau_var.push("s" + (i+1));
	}

	tableau_var.push("Z", "RHS");

	mat[0] = tableau_var;

	 constraintsList.forEach(function(part, index, arr){
	 	slack_var[index] = ('s' + parseInt(index+1));
	 	tableau_var = [];
	 	var slack = 1;
	 	if((arr[index]).indexOf(">") != -1 && mode == 1) slack = -1;
		var str = (arr[index]).replace(/[^a-z0-9\+\-\.\=]/g, "");

		// add variables per constraint
		vars.forEach(function(data){
			var pos = str.indexOf(data);
			var coeff = 0;
			
			if(pos != -1){
				for(var i = pos; i >= 0; i--){
					if(str[i] == '+'){
						coeff = parseFloat(str.substr(i+1, pos-1));
						coeff = coeff ? coeff : 1;
						break;
		  			}
		  			else if(str[i] == '-'){
		  				coeff = 0 - parseFloat(str.substr(i+1, pos-1));
		  				coeff = coeff ? coeff : -1;
		  				break;
		  			}
		  			else if(i == 0){
						coeff = parseFloat(str.substr(i, pos));
						coeff = coeff ? coeff : 1;
						break;
		  			}
				}
			}

			tableau_var.push(coeff);
		});
		
		// add slack variables
		for(var i = 0; i < constraintsList.length; i++){			
			if(index == i) tableau_var.push(slack);
			else tableau_var.push(0);
		}
		// add Z
		tableau_var.push(0);

		// add RHS
		for(var i = 0; i <= str.length; i++){
			if(str[i] == '='){
				tableau_var.push(parseFloat(str.substr(i+1, str.length)));
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
			tableau_var.push(0 - coeff);
	});
		
	for(var i = 0; i < constraintsList.length; i++){
		tableau_var.push(0);
	}
	
	tableau_var.push(1, 0);
		
	mat.push(tableau_var);
	
	if(mode == 0) transpose();

	tableaus[0] = mat;

	console.log(mat);

	performOps();	// start iteration
}

function performOps(){
	console.log("Solving problem...");
	var tempMat = [[]]

	while(1){

	var prev = tableaus[tableaus.length-1];

	tempMat = (tableaus[tableaus.length - 1]).map(function(arr) {
   		return arr.slice();
	});	// create a copy of the prev matrix

	console.log(tempMat);

	var temp = []
	var TR = [];

	// find pivot column (smallest non-negative)
	var pivotCol_value = Math.min.apply(Math, tempMat[tempMat.length - 1]);
	if(pivotCol_value >= 0) break;

	var pivotCol_i = (tempMat[tempMat.length - 1]).indexOf(pivotCol_value);

	for(var i = 1; i < tempMat.length - 1; i++){
		TR[i-1] = tempMat[i][(tempMat[i]).length - 1] / tempMat[i][pivotCol_i];
		TR[i-1] = TR[i-1] || -1;
		if(TR[i-1] < 0) TR[i-1] = 9999;
	}

	var pivotRow_value = Math.min.apply(Math, TR);
	var pivotRow_i = TR.indexOf(pivotRow_value) + 1;

	var pivotValue = tempMat[pivotRow_i][pivotCol_i];

	var pivotRow = tempMat[pivotRow_i];
	for(var i = 0; i < pivotRow.length; i++){
		pivotRow[i] = pivotRow[i]/pivotValue;
	}

	for(var j = 1; j < tempMat.length; j++){
		if(j!=pivotRow_i){
			var t = tempMat[j][pivotCol_i];
				for(var i = 0; i < pivotRow.length; i++){
					temp[i] = pivotRow[i] * t;
					tempMat[j][i] = tempMat[j][i] - temp[i];
				}
		}
	}

	tableaus.push(tempMat);
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

	console.log("Z = " + fmat[fmat.length-1][var_row.length]);
	// var eq = eval(fx);
	// alert(fx);
}

function transpose(){
	
	for(var i = 0; i < (mat.length - 2); i++){
		for(var j = 0; j < i; j++){
      		var temp = mat[i+1][j];
      		mat[i+1][j] = mat[j+1][i];
    		mat[j+1][i] = temp;
		}
	}

	for(var j = 0; j < mat.length - 1; j++){
      		var temp = mat[mat.length-1][j];
      		mat[mat.length-1][j] = -(mat[j+1][mat[0].length - 1]);
      		mat[j+1][mat[0].length - 1] = -temp;
	}	
}