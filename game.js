var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var started = false;
var highScore = 0;
var gameSpeed = 1000;

$(document).ready(function() {
  updateLevelDisplay();
  loadHighScore();
  $("#start-btn").click(function() {
    if (!started) {
      startGame();
    } else {
      showMessage("Game in progress!", "warning");
    }
  });
  $("#difficulty").change(function() {
    const difficulty = $(this).val();
    switch (difficulty) {
      case "fast":
        gameSpeed = 700;
        break;
      case "extreme":
        gameSpeed = 400;
        break;
      default:
        gameSpeed = 1000;
    }
    
    if (!started) {
      showMessage(`Difficulty set to ${difficulty}`, "info");
    } else {
      showMessage("Difficulty will change on next game", "info");
    }
  });
  $(document).keypress(function(e) {
    if (!started && (e.key === "a" || e.key === "A" || e.key === " " || e.key === "Enter")) {
      startGame();
    }
  });
  
  // Button click event
  $(".btn").click(function() {
    if (started) {
      var userChosenColor = $(this).attr("id");
      userClickedPattern.push(userChosenColor);
      playSound(userChosenColor);
      animatePress(userChosenColor);
      checkAnswer(userClickedPattern.length - 1);
    } else {
      showMessage("Press START to begin the game!", "info");
    }
  });
});

function startGame() {
  resetGame();
  $("#level-title").text("Watch Carefully!");
  setTimeout(function() {
    nextSequence();
  }, 1000);
  started = true;
  $("#start-btn").text("PLAYING...");
}

function nextSequence() {
  level++;
  updateLevelDisplay();
  userClickedPattern = [];
  if (level === 1) {
    $("#level-title").text("Follow the pattern");
  } else if (level >= 10) {
    $("#level-title").text("Master Level " + level + "!");
  } else {
    $("#level-title").text("Level " + level);
  }
  
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);
  showPattern();
}

function showPattern() {
  let i = 0;
  const interval = setInterval(function() {
    const color = gamePattern[i];
    flashButton(color);
    playSound(color);
    i++;
    if (i >= gamePattern.length) {
      clearInterval(interval);
      $("#level-title").text("Your Turn!");
    }
  }, gameSpeed / 2);
}

function flashButton(color) {
  $("#" + color).fadeIn(100).fadeOut(100).fadeIn(100);
}

function updateLevelDisplay() {
  $("#level-count").text(level);
}

function playSound(colorName) {
  var audio = new Audio("sounds/" + colorName + ".mp3");
  audio.play();
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function() {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      if (level > highScore) {
        highScore = level;
        saveHighScore();
        $("#high-score").text(highScore);
      }
      
      setTimeout(function() {
        nextSequence();
      }, gameSpeed);
    }
  } else {
    playSound("wrong");
    $("body").addClass("game-over");
    $("#level-title").text("Game Over!");
    
    setTimeout(function() {
      $("body").removeClass("game-over");
      $("#level-title").text("Press START to Try Again");
      $("#start-btn").text("START GAME");
    }, 1500);
    
    startOver();
  }
}

function startOver() {
  started = false;
}

function resetGame() {
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
}

function loadHighScore() {
  if (localStorage.getItem("simonHighScore")) {
    highScore = parseInt(localStorage.getItem("simonHighScore"));
    $("#high-score").text(highScore);
  }
}

function saveHighScore() {
  localStorage.setItem("simonHighScore", highScore);
}

function showMessage(msg, type) {
  const messageEl = $("<div class='game-message'></div>")
    .text(msg)
    .css({
      position: "fixed",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "10px 20px",
      borderRadius: "5px",
      backgroundColor: type === "warning" ? "#e74c3c" : "#3498db",
      color: "white",
      fontFamily: "'Press Start 2P', cursive",
      fontSize: "0.8rem",
      zIndex: 1000,
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      opacity: 0
    })
    .appendTo("body")
    .animate({ opacity: 1 }, 300);
  setTimeout(function() {
    messageEl.animate({ opacity: 0 }, 300, function() {
      $(this).remove();
    });
  }, 2000);
}