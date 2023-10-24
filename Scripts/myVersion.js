/*----------------Steps 1 canvas Setting---------------*/
const canvas = document.getElementById("ballCanvas");
const ctx = canvas.getContext("2d");
const unit = 10;
const row = canvas.height / unit;
const column = canvas.width / unit;
// get border width for adjusting the ground setting
const computedStyle = window.getComputedStyle(canvas);
const canvasBorderWidth = parseInt(
  computedStyle.getPropertyValue("border-width"),
  10
);

/*---------------Score setting--------------*/
const scoreHTML2 = document.querySelector(".score2");
const scoreHTML1 = document.querySelector(".score1");
let score1 = 0;
let score2 = 0;

// try object later //
/*----------------------Ball and wall setting--------------------*/
let ball_x = 175; //------//
let ball_y = 111; //------//
let ballRadius = unit / 2;
let speed_x = 4;
let speed_y = 4;
// can scoring or not
let canScore = true;

// ground movement
let groundMove_speed = 10;
// ground bottom setting
let groundHeight = 5;
let groundWidth = 60;
let ground_x = canvas.width / 2 - groundWidth / 2;
let ground_y = canvas.height - 100;
// ground top setting
let groundHeight2 = 5;
let groundWidth2 = 60;
let ground_x2 = canvas.width / 2 - groundWidth / 2;
let ground_y2 = 100;
// Moving Boolean
let leftMoving_1 = false;
let rightMoving_1 = false;
let leftMoving_2 = false;
let rightMoving_2 = false;

// Draw before start game
let starGame = false;
let StartIntervalID = setInterval(drawBeforeStart, 15);

// move gorund setting (Boolean and eventListerner)
// Arrow control 1 (bottom)
// wasd control 2 (top)
// Moving true
// Start game
let canvasZoomOut;
let game;

window.addEventListener("keydown", (event) => {
  // console.log(event);
  if (event.key === "ArrowLeft") {
    leftMoving_1 = true;
  } else if (event.key === "ArrowRight") {
    rightMoving_1 = true;
  }

  if (event.key === "a") {
    leftMoving_2 = true;
  } else if (event.key === "d") {
    rightMoving_2 = true;
  }

  if (event.key === " " && !starGame) {
    starGame = true;

    clearInterval(StartIntervalID);

    canvasZoomOut = setInterval(zoomOut, 5000);

    game = setInterval(drawBall, 15);
  }
});
//Moving false
window.addEventListener("keyup", (event) => {
  // console.log(event);
  if (event.key === "ArrowLeft") {
    leftMoving_1 = false;
  } else if (event.key === "ArrowRight") {
    rightMoving_1 = false;
  }

  if (event.key === "a") {
    leftMoving_2 = false;
  } else if (event.key === "d") {
    rightMoving_2 = false;
  }
});

function drawBall() {
  // check winner with score
  if (score1 === 5) {
    clearInterval(game);
    clearInterval(canvasZoomOut);
    setTimeout(() => {
      alert("Player 2 Lost ! Stupid !");
    }, 100);
  } else if (score2 === 5) {
    clearInterval(game);
    clearInterval(canvasZoomOut);
    setTimeout(() => {
      alert("Player 1 Lost ! Stupid !");
    }, 100);
  }

  // change the ball x, y
  ball_x += speed_x;
  ball_y += speed_y;

  // be aware about the if statement about acceleration ball_y
  // Ground impact checking
  //bottom
  if (
    ball_x >= ground_x - ballRadius &&
    ball_x <= ground_x + groundWidth + ballRadius &&
    ball_y >= ground_y - ballRadius &&
    ball_y <= ground_y + groundHeight + ballRadius
  ) {
    if (speed_y > 0) {
      ball_y -= ballRadius * 2 + 1;
    } else {
      ball_y += ballRadius * 2 + 1;
    }

    speed_y *= -1;
  }
  // top
  if (
    ball_x >= ground_x2 - ballRadius &&
    ball_x <= ground_x2 + groundWidth2 + ballRadius &&
    ball_y >= ground_y2 - ballRadius &&
    ball_y <= ground_y2 + groundHeight2 + ballRadius
  ) {
    if (speed_y > 0) {
      ball_y -= ballRadius * 2 + 1;
    } else {
      ball_y += ballRadius * 2 + 1;
    }

    speed_y *= -1;
  }

  /// Wall setting
  // if the ball touch the bottom, game over
  if (ball_x + ballRadius >= canvas.width || ball_x - ballRadius <= 0) {
    speed_x *= -1;
  }

  if (ball_y + ballRadius >= canvas.height || ball_y - ballRadius <= 0) {
    speed_y *= -1;
    if (speed_y < 0) {
      ball_y -= ballRadius;
    } else {
      ball_y += ballRadius;
    }
  }

  // if (ball_y + ballRadius >= canvas.height) {
  //   alert("Stupid Idiot !");
  //   clearInterval(game);
  // }

  // draw background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /*---------Draw floor-------*/
  // check moving? first
  // bottom
  if (leftMoving_1 && ground_x > 0) {
    ground_x -= groundMove_speed;
  } else if (rightMoving_1 && ground_x + groundWidth < canvas.width) {
    ground_x += groundMove_speed;
  }

  if (leftMoving_2 && ground_x2 > 0) {
    ground_x2 -= groundMove_speed;
  } else if (rightMoving_2 && ground_x2 + groundWidth2 < canvas.width) {
    ground_x2 += groundMove_speed;
  }

  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, groundWidth, groundHeight);
  // top
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x2, ground_y2, groundWidth2, groundHeight2);

  // draw ball
  //x, y, radius,
  ctx.beginPath();
  ctx.arc(ball_x, ball_y, ballRadius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();

  // Scoring system
  if (ball_y + ballRadius >= canvas.height - ballRadius * 2 && canScore) {
    score2 += 1;
    canScore = false;
    scoreHTML2.innerHTML = score2;
  } else if (ball_y - ballRadius <= ballRadius * 2 && canScore) {
    score1 += 1;
    canScore = false;
    scoreHTML1.innerHTML = score1;
  }

  if (!canScore) {
    if (
      ball_y + ballRadius < canvas.height - ballRadius * 2 &&
      ball_y - ballRadius > ballRadius * 2
    ) {
      canScore = true;
    }
  }
}

// zoomOut the canvas
function zoomOut() {
  canvas.height -= unit * 1.5;
  ground_y -= unit * 1.5;
}

// draw berfore start game function
function drawBeforeStart() {
  // draw background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /*---------Draw floor-------*/
  // check moving? first
  // bottom
  if (leftMoving_1 && ground_x > 0) {
    ground_x -= groundMove_speed;
  } else if (rightMoving_1 && ground_x + groundWidth < canvas.width) {
    ground_x += groundMove_speed;
  }

  if (leftMoving_2 && ground_x2 > 0) {
    ground_x2 -= groundMove_speed;
  } else if (rightMoving_2 && ground_x2 + groundWidth2 < canvas.width) {
    ground_x2 += groundMove_speed;
  }

  // let ball follow the ground mid
  ball_x = ground_x2 + groundWidth2 / 2;

  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, groundWidth, groundHeight);
  // top
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x2, ground_y2, groundWidth2, groundHeight2);

  // draw ball
  //x, y, radius,
  ctx.beginPath();
  ctx.arc(ball_x, ball_y, ballRadius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

//Algorithm
/*
  1. Create another floor (include impact)
  2. set the floor control by keyboard
  3. set goal line
  
  Additional :
  4. ball initial position

*/

// canvas zoom out
/* 
  1. zoom out by "unit" per 5 seconds (change the canvas height)
  2. scoring zone

*/

/* Thank you */
