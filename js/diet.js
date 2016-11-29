var content = "";
var temp;
var types = ["vegetables", "fruits", "breads", "pasta", "dairy", "meat", "cereal", "soup", "others"];

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