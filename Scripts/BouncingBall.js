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
let count = 0;

// try object later //
/*----------------------Ball and wall setting--------------------*/
let ball_x = 5; //------//
let ball_y = 5; //------//
let ballRadius = unit / 2;
let speed_x = 4;
let speed_y = 4;

// ground setting
let groundHeight = 5;
let groundWidth = 60;
let ground_x = canvas.width / 2 - groundWidth / 2;
let ground_y = 500;

/*---------------Bricks setting-------------*/
let bricksArray = [];

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 15;
    // bricksArray.push(this);
    this.visible = true;
  }

  drawBrick() {
    ctx.fillStyle = "white";
    // ctx.strokeStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  touchBall() {
    return (
      ball_x >= this.x - ballRadius &&
      ball_x <= this.x + this.width + ballRadius &&
      ball_y >= this.y - ballRadius &&
      ball_y <= this.y + this.height + ballRadius
    );
  }

  checkOverlap() {
    let overlapping = false;
    // let new_brick_x;
    // let new_brick_y;

    checkingNow(this);
    function checkingNow(newBrick) {
      // console.log(newBrick);
      for (let i = 0; i < bricksArray.length; i++) {
        let oldBrick = bricksArray[i];
        //the algorithm of the overlapping check
        if (
          newBrick.x <= oldBrick.x + oldBrick.width &&
          newBrick.x + newBrick.width >= oldBrick.x &&
          newBrick.y <= oldBrick.y + oldBrick.height &&
          newBrick.y + newBrick.height >= oldBrick.y
        ) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    while (overlapping) {
      this.x = getRandomArbitrary(40, 280);
      this.y = getRandomArbitrary(60, 400);
      checkingNow(this);
      // newBrick.x = "stupid";
      // newBrick.y = "stupid2";
    }

    // console.log(this);
  }
}

// draw bricks
function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

for (let i = 0; i < 10; i++) {
  let brick = new Brick(
    getRandomArbitrary(40, 280),
    getRandomArbitrary(60, 400)
  );

  brick.checkOverlap();

  bricksArray.push(brick);
}

//get canvas clientX for adjusting the ground
let canvasRect = canvas.getBoundingClientRect();
window.addEventListener("resize", () => {
  canvasRect = canvas.getBoundingClientRect();
});

// Make mouse in the middle of the ground
// clientX -> value of the position in the canvas
canvas.addEventListener("mousemove", (event) => {
  // console.log(event);
  ground_x =
    event.clientX - canvasRect.left - canvasBorderWidth - groundWidth / 2;
});

function drawBall() {
  // See if the ball touch the brick then change ball direction
  bricksArray.forEach((brick) => {
    if (brick.visible && brick.touchBall()) {
      brick.visible = false;
      // change x, y speed by checking the direction
      // take off the birck
      if (ball_x <= brick.x || ball_x >= brick.x + brick.width) {
        speed_x *= -1;
      } else if (ball_y <= brick.y || ball_y >= brick.y + brick.height) {
        speed_y *= -1;
      }

      // Another way to optimize the system
      count++;
      // console.log(count);

      // O(n)
      // bricksArray.splice(index, 1); // O(n)

      if (count === 10) {
        setTimeout(() => {
          alert("Well Play !");
          clearInterval(game);
        }, 100);
      }
    }
  });

  // change the circle x, y
  ball_x += speed_x;
  ball_y += speed_y;

  // Ground impact checking
  if (
    ball_x >= ground_x - ballRadius &&
    ball_x <= ground_x + groundWidth + ballRadius &&
    ball_y >= ground_y - ballRadius &&
    ball_y <= ground_y + groundHeight + ballRadius
  ) {
    if (speed_y > 0) {
      ball_y -= 11;
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
  }

  if (ball_y + ballRadius >= canvas.height) {
    alert("Stupid Idiot !");
    clearInterval(game);

    setTimeout(() => {
      let game = setInterval(drawBall, 15);
    });
  }

  // draw background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //draw Bricks
  bricksArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  // Draw floor
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, groundWidth, groundHeight);

  // draw ball
  //x, y, radius,
  ctx.beginPath();
  ctx.arc(ball_x, ball_y, ballRadius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

let game = setInterval(drawBall, 15);
