
var Letter = function(typedLetter) {
	this.typedLetter = typedLetter.toUpperCase();
	this.letterGuessedCorrectly = false;
	this.showtypedLetter = function() {
		if (this.letterGuessedCorrectly) {
			console.log(this.typedLetter);
		}
		else {
		}

	}
}

module.exports = Letter;