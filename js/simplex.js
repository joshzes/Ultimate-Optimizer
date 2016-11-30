var mode 	// 1 for maximize, 0 for minimize
var mat = [];	// will contain initial tableau
var tableaus = [];
var vars = [];

function simplex(optMode, fxString, constraintsList){
	mode = optMode;
	mat = []
	vars = fxString.replace(/[^a-z]/g, "").split("");

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
	 	tableau_var = [];
		var str = (arr[index]).replace(/[^a-z0-9\+\-\.\=]/g, "");

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
		
		for(var i = 0; i < constraintsList.length; i++){
			if(index == i) tableau_var.push(1);
			else tableau_var.push(0);
		}
		tableau_var.push(0);

		for(var i = 0; i <= str.length; i++){
			if(str[i] == '='){
				tableau_var.push(parseFloat(str.substr(i+1, str.length)));
				break;
			}
		}
		
		mat.push(tableau_var);
	});

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
	tableaus[0] = mat;
	performOps();
}

function performOps(){
	var tempMat;

	while(1){
	tempMat = (tableaus[tableaus.length - 1]).map(function(arr) {
    	return arr.slice();
	});

	var temp = []
	var TR = [];
	var pivotCol_value = Math.min.apply(Math, tempMat[tempMat.length - 1]);
	if(pivotCol_value >= 0) break;

	var pivotCol_i = (tempMat[tempMat.length - 1]).indexOf(pivotCol_value);

	for(var i = 1; i < tempMat.length - 1; i++){
		TR[i-1] = tempMat[i][(tempMat[i]).length - 1] / tempMat[i][pivotCol_i];
		if(TR[i-1] < 0) TR[i-1] = 9999;
	}

	var pivotRow_value = Math.min.apply(Math, TR);
	var pivotRow_i = TR.indexOf(pivotRow_value) + 1;

	var pivotValue = tempMat[pivotRow_i][pivotCol_i];

	console.log(pivotRow_value + " " + pivotCol_value + " " + pivotValue);

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
}