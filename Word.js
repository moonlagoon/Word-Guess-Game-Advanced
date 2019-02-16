
var Letter = require("./Letter");

var Word = function(randoWord) {
	this.randoWord = randoWord;
	this.letters = [];
	
	this.underscores = [];
	
	this.splitWord = function() {
		this.letters = this.randoWord.split("");
		
		numberUnderscoresNeeded = this.letters.length;
		
		console.log(this.underscores.join(" "));
	}
	this.generateLetters = function() {
		for (i=0; i < this.letters.length; i++){
			this.letters[i] = new Letter (this.letters[i]);

			this.letters[i].showCharacter();
		}
	}
}

module.exports = Word;