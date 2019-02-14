var Word = require("./Word.js");

var inquirer = require("inquirer");
var clc = require('cli-color');
var figlet = require('figlet');
var isLetter = require('is-letter');
const boxen = require('boxen');

var incorrect = clc.red.bold;
var correct = clc.green.bold;
var colorText = clc.blueBright;

var userGuessedCorrectly = false;

var wordList = ["florida", "coding", "brocolli", "halloween", "beer", "carrot", "amusement", "construe", "mountain", "attraction", "queen", "aquatic", "dramatic", "pancake", "anxious", "balloon"];

var randomWord;
var someWord;
var wins = 0;
var losses = 0;
var guessesRemaining = 10;
var userGuess = "";

var lettersAlreadyGuessedList = "";
var lettersAlreadyGuessedListArray = [];

var spotsFilled = 0;

figlet("Luna's Word Guess Game", function (err, data) {
	if (err) {
		console.log('oops...');
		console.dir(err);
		return;
	}
	console.log(data)

	console.log(colorText("Word Guess Game"));
	console.log(colorText("You have 12 guesses to guess the correct word"));

	var howToPlay =
		"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" + "\r\n" +
		"A random word will be given. Guess letters A-Z on your keyboard to Figure out the correct word." + "\r\n" +
		"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~=" + "\r\n" +
		"You can exit the game at any time by pressing Ctrl + C on your keyboard." + "\r\n" +
		"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~="
	console.log(colorText(howToPlay));
	confirmStart();
});

function confirmStart() {
	var readyToStartGame = [
		{
			type: 'text',
			name: 'playerName',
			message: 'What is your name?'
		},
		{
			type: 'confirm',
			name: 'readyToPlay',
			message: 'Are you ready to play?',
			default: true
		}
	];

	inquirer.prompt(readyToStartGame).then(answers => {

		if (answers.readyToPlay) {
			console.log(colorText("Welcome, " + answers.playerName + ". Here we go!"));
			startGame();
		}

		else {

			console.log(colorText("bye bye " + answers.playerName + "!"));
			return;
		}
	});
}

function startGame() {

	guessesRemaining = 12;

	chooseRandomWord();

	lettersAlreadyGuessedList = "";
	lettersAlreadyGuessedListArray = [];
}

function chooseRandomWord() {

	randomWord = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();

	someWord = new Word(randomWord);

	console.log(colorText("There are " + randomWord.length + " letters in this word"));
	console.log(colorText("TARGET WORD:"));

	someWord.splitWord();
	someWord.generateLetters();
	guessLetter();
}

function guessLetter() {

	if (spotsFilled < someWord.letters.length || guessesRemaining > 0) {
		inquirer.prompt([
			{
				name: "letter",
				message: "Guess letter:",

				validate: function (value) {
					if (isLetter(value)) {
						return true;
					}
					else {
						return false;
					}
				}
			}
		]).then(function (guess) {

			guess.letter.toUpperCase();
			console.log(colorText("You guessed: " + guess.letter.toUpperCase()));

			userGuessedCorrectly = false;

			if (lettersAlreadyGuessedListArray.indexOf(guess.letter.toUpperCase()) > -1) {

				console.log(colorText("You've already guessed that!"));
				console.log(colorText("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"));
				guessLetter();
			}

			else if (lettersAlreadyGuessedListArray.indexOf(guess.letter.toUpperCase()) === -1) {

				lettersAlreadyGuessedList = lettersAlreadyGuessedList.concat(" " + guess.letter.toUpperCase());

				lettersAlreadyGuessedListArray.push(guess.letter.toUpperCase());

				console.log(boxen(colorText('Letters already guessed: ') + lettersAlreadyGuessedList, { padding: 1 }));

				for (i = 0; i < someWord.letters.length; i++) {

					if (guess.letter.toUpperCase() === someWord.letters[i].character && someWord.letters[i].letterGuessedCorrectly === false) {
						someWord.letters[i].letterGuessedCorrectly === true;
						userGuessedCorrectly = true;
						someWord.underscores[i] = guess.letter.toUpperCase();
						spotsFilled++
					}
				}
				console.log(colorText("TARGET WORD:"));
				someWord.splitWord();
				someWord.generateLetters();


				if (userGuessedCorrectly) {

					console.log(correct('CORRECT'));
					console.log(colorText("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"));

					checkIfUserWon();
				}

				else {

					console.log(incorrect('INCORRECT'));

					guessesRemaining--;
					console.log(colorText("You have " + guessesRemaining + " guesses remaining."));
					console.log(colorText("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"));

					checkIfUserWon();
				}
			}
		});
	}
}

function checkIfUserWon() {
	if (guessesRemaining === 0) {
		console.log(colorText("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"));
		console.log(incorrect('YOU LOST. TOO BAD!'));
		console.log(colorText("Correct word was: ------------> " + randomWord + " <------------"));

		losses++;

		console.log(colorText("Win: " + wins));
		console.log(colorText("Lose: " + losses));
		console.log(colorText("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"));

		playAgain();
	}
	else if (spotsFilled === someWord.letters.length) {
		console.log(colorText("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"));
		console.log(correct("YOU WON! CONGRATULATIONS!"));

		wins++;

		console.log(colorText("Win: " + wins));
		console.log(colorText("Lose: " + losses));
		console.log(colorText("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"));

		playAgain();
	}

	else {

		guessLetter("");
	}

}
function playAgain() {
	var playGameAgain = [
		{
			type: 'confirm',
			name: 'playAgain',
			message: 'Retry?',
			default: true
		}
	];

	inquirer.prompt(playGameAgain).then(userWantsTo => {
		if (userWantsTo.playAgain) {

			lettersAlreadyGuessedList = "";
			lettersAlreadyGuessedListArray = [];
			spotsFilled = 0;
			console.log(colorText("Awesome! Let's play..."));

			startGame();
		}
		else {
			console.log(colorText("Good bye!"));
			return;
		}
	});
}
