var content = "";
var temp;
var types = ["vegetables", "fruits", "breads", "pasta", "dairy", "meat", "cereal", "soup", "others"];
var nutr = ["calories","cholesterol", "total_fat", "sodium", "carbs", "fiber", "protein", "vit_a", "vit_c", "calcium", "iron"];
var min = [2000, 0, 0, 0, 0, 25, 50, 5000, 50, 800, 10];
var max = [2250, 300, 65, 2400, 300, 100, 100, 50000, 20000, 1600, 30];
var checkedFoods;

$(document).ready(function(){

	types.forEach(function(data){
		content = "";

		content += "<ul class='collapsible' data-collapsible='accordion'>";
		(eval(data)).forEach(readData);
		content += "</ul>";
		$(content).appendTo($("#" + data + "-container"));

	});

    $('.collapsible').collapsible();
});

function readData(data){
	temp = data['food'];
			tempId = temp.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
			content +=	"<li>"
							+ "<div class='collapsible-header'>"
								+ "<input type='checkbox' class='filled-in' id='" + tempId + "'' />"
     							+ "<label for='" + tempId + "'>" + temp + "</label>"
					 		+ "</div>"
							+ "<div class='collapsible-body'>"
								+ "<table><tbody>"
								+ "<tr><td>Price</td> <td>" + data['price'] + "</td></tr>"
								+ "<tr><td>Serving Size</td> <td>" + data['serving'] + "</td></tr>"
								+ "<tr><td>Calories</td> <td>" + data['calories'] + "</td></tr>"
								+ "<tr><td>Cholesterol</td> <td>" + data['cholesterol'] + "</td></tr>"
								+ "<tr><td>Total Fat</td> <td>" + data['total_fat'] + "</td></tr>"
								+ "<tr><td>Sodium</td> <td>" + data['sodium'] + "</td></tr>"
								+ "<tr><td>Carbohydrates</td> <td>" + data['carbs'] + "</td></tr>"
								+ "<tr><td>Fiber</td> <td>" + data['fiber'] + "</td></tr>"
								+ "<tr><td>Protein</td> <td>" + data['protein'] + "</td></tr>"
								+ "<tr><td>Vitamin A</td> <td>" + data['vit_a'] + "</td></tr> "
								+ "<tr><td>Vitamin C</td> <td>" + data['vit_c'] + "</td></tr> "
								+ "<tr><td>Calcium</td> <td>" + data['calcium'] + "</td></tr> "
								+ "<tr><td>Iron</td> <td>" + data['iron'] + "</td></tr>"
								+ "</tbody></table>"
							+ "</div>"
						+ "</li>"
}

$("#submitProblem").click(function(){
	var idSelector = function() { return this.id; };
	checkedFoods = $(":checkbox:checked").map(idSelector).get();
//	checkedFoods = ["frozenbroccoli", "carrotsraw", "celeryraw", "frozencorn", "lettuceicebergraw", "pepperssweetraw", "potatoesbaked", "tofu", "tomatoredriperaw", "applerawwskin", "banana", "grapes", "kiwifruitrawfresh", "oranges", "bagels", "wheatbread", "whitebread", "oatmealcookies", "spaghettiwsauce", "roastedchicken"];
//	checkedFoods = ["frozenbroccoli", "carrotsraw", "celeryraw", "frozencorn", "lettuceicebergraw", "pepperssweetraw"];
//	checkedFoods = ["frozenbroccoli", "potatoesbaked", "whitebread", "tofu", "oatmealcookies", "roastedchicken", "wheatbread"];
	setupProblem();
	$('#submitProblem').hide();
	$('#diet-container').slideUp(400);

	$('#results-container').removeClass("animated slideOutDown hidden").addClass("visible");
});

$("#editProblem").click(function(){
	$('#results-container').addClass("animated slideOutDown");
	$('#diet-container').slideDown(800);
	$('#tableau').html("");

});


function setupProblem(){

	// convert input to equations

	var eq = "C = ";
	var constraints = [];
	var foods = []
	for(var i = 0; i < checkedFoods.length; i++){
		var f;
		types.forEach(function(data){
			(eval(data)).forEach(function(temp){
			if(temp['food'].replace(/[^a-zA-Z0-9]/g, "").toLowerCase() == checkedFoods[i]){
				f = temp;
			}
			});
		});
		if(String.fromCharCode(97 + i) == 'e') eq += "(" + f['price'] + " * " + String.fromCharCode(122) + ")";
		else eq += "(" + f['price'] + " * " + String.fromCharCode(97 + i) + ")";
		if(i != checkedFoods.length - 1) eq += " + "
		foods[i] = f;
	}
	console.log(eq);

	for(var i = 0; i < nutr.length; i++){
		var tempConst = "";
		for(var j = 0; j < foods.length; j++){
			if(String.fromCharCode(97 + j) == 'e') tempConst += "(" + foods[j][nutr[i]] + " * " + String.fromCharCode(122) + ")";			
			else tempConst += "(" + foods[j][nutr[i]] + " * " + String.fromCharCode(97 + j) + ")";			
			if(j != foods.length - 1) tempConst += " + ";
			else tempConst += " >= " + min[i];
		}
		constraints.push(tempConst);
	}

	for(var i = 0; i < nutr.length; i++){
		var tempConst = "";
		for(var j = 0; j < foods.length; j++){
			if(String.fromCharCode(97 + j) == 'e') tempConst += "(" + foods[j][nutr[i]] + " * " + String.fromCharCode(122) + ")";			
			else tempConst += "(" + foods[j][nutr[i]] + " * " + String.fromCharCode(97 + j) + ")";
			if(j != foods.length - 1) tempConst += " + ";
			else tempConst += " <= " + max[i];
		}
		constraints.push(tempConst);
	}

	for(var i = 0; i < foods.length; i++){
		var tempConst = "1 * ";
		if(String.fromCharCode(97 + j) == 'e') tempConst += String.fromCharCode(122) + "<= 0";
		else tempConst += String.fromCharCode(97 + i) + "<= 10";
		constraints.push(tempConst);
	}

	console.log(eq);
	for(var i = 0; i < constraints.length; i++)
		console.log(constraints[i]);

	simplex(0, eq, constraints);
	showTableau(final);
	$('#cost').html("Cost = " + parseFloat(z.toFixed(4)));
}