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
							+ "<div class='collapsible-body'><p>"
								+ data['price'] + ","
								+ data['serving'] + ","
								+ data['calories'] + ","
								+ data['cholesterol'] + ","
								+ data['total_fat'] + ","
								+ data['sodium'] + ","
								+ data['carbs'] + ","
								+ data['fiber'] + ","
								+ data['protein'] + ","
								+ data['vit_a'] + ","
								+ data['vit_c'] + ","
								+ data['calcium'] + ","
								+ data['iron']
							+ "</p></div>"
						+ "</li>"
}

/*

FIX:
	UI of collapsible-body
	UI of button

*/