var mode = 1 // 0 for minimize
var mat = [[]];

function simplex(optMode, fxString, constraintsList){
	mode = optMode;

	// read constraint[i] until a, b, c, d (if not found before + or -) --> 0
	// add slack (S(i)) = 1
	// add row to mat

	// Z = 1a + 2b + 1c − 1d 
	// read fxString until a, b, c, d (if not found before + or -) --> 0
	// add row to mat
}