var buttonColours = ["red", "blue", "green", "yellow"];
var cpuPattern = [];
var userPattern = [];
var level = 0;

function generateRandomInt() {
    // 0 to 3 inlcusive
    return Math.floor(Math.random() * 4);
}

function playColorAudio(color) {
    let audio = new Audio("sounds/" + color + ".mp3");
    audio.play();
}

/**
 *  Util function1 for click handler 
 *  flash button when user press it
 */
function animatePress(color) {
    // flash any html element with the id color
    $("#" + color).addClass("pressed");

    setTimeout(function() {
        $("#" + color).removeClass("pressed");
    }, 100);
}


/**
 * Util function2 for click handler to check if
 * button entered by user is correct. if it is, 
 * it will call the next sequence if button presed is correct
 */
function checkLastButtonCorrectness(currentLevelIndex) {
    // 1. compare the last input
    if (cpuPattern[currentLevelIndex] === userPattern[currentLevelIndex]) {

        // flash success
        // 2. check if they finished entering all the cpuPattern
        if (cpuPattern.length === userPattern.length) {

            animateCorrect();
            // call next sequence
            setTimeout(function() {
                playNext();
            }, 1000);
        }

    } else {
        let audio = new Audio("sounds/wrong.mp3");
        audio.play();
        // make background flash red
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 500);

        // change title
        $("h1").text("Game Over, Press Any Key to Restart");
        startOver();
    }
}


function animateCorrect() {
    // flash any html element with the id color
    buttonColours.forEach(color => {
        // add correct
        $("#" + color).addClass("correct");

        // remove after half second
        setTimeout(function() {
            $("#" + color).removeClass("correct");
        }, 600);
    })
}

async function playCpuSequence() {
    // play the rest after delay
    for (let i = 0; i < cpuPattern.length; i++) {
        playColorAudio(cpuPattern[i]);
        $("#" + cpuPattern[i]).fadeOut(100).fadeOut(100).fadeIn(100);
        await sleep(700);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 *  Program 1. Will flash the next random button and add to sequence.
 *  This function will be called by if user enter the correct sequence
 *  or if game just started
 */
function playNext() {

    // reset
    userPattern = [];

    // 1. show level
    level++;
    $("#level-title").text("Level " + level);

    // 2. choose the button
    let ranNum = generateRandomInt();
    let randomColor = buttonColours[ranNum];
    cpuPattern.push(randomColor);
    // console.log("cpu pattern: " + cpuPattern);
    // console.log("user pattern: " + userPattern);

    // 3. flash button and play audio for user to echo
    playCpuSequence();
}

/**
 *  Program 2 When button is clicked, the funcion will flash button and play audio 
 *  and check if button is correct
 */
function clickHandler() {
    // this is the button
    // get the id and store the name which is the string
    // push this to the array
    let userColor = this.id;
    userPattern.push(userColor);
    animatePress(userColor);
    playColorAudio(userColor);
    checkLastButtonCorrectness(userPattern.length - 1);
}

var hasGameStart = false;

/**
 * Function that will be called when the game is over
 */
function startOver() {
    level = 0;
    cpuPattern = [];
    userPattern = [];
    hasGameStart = false;
}

/**
 * Add handler to the colored buttons
 */
$(".btn").on("click", clickHandler);

/**
 * Game starts on keydown
 */
$(document).on("keydown", function(e) {
    if (hasGameStart == false) {
        $("h1").text("level " + level);
        playNext();
        hasGameStart = true;
    }
});