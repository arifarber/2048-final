/*
Add your code for Game here
 */
var size = 0;
var gameState = {
  board: [],
  score: 0,
  won: false,
  over: false,
};
var onLoseObservers = [];
var onWinObservers = [];
var onMoveObservers = [];

export default class Game {
  constructor(theSize) {
    gameState = this.gameState;
    gameState = {
      board: [],
      score: 0,
      won: false,
      over: false,
    };
    size = this.size;
    size = theSize;
    for (let i = 0; i < size * size; i++) {
      gameState.board[i] = 0;
    }
    this.generateTile();
    this.generateTile();
  }
  setupNewGame() {
    for (let i = 0; i < size * size; i++) {
      gameState.board[i] = 0;
    }
    gameState.score = 0;
    //ok
    gameState.won = false;
    gameState.over = false;
    this.generateTile();
    this.generateTile();
  }
  loadGame(gameStateNew) {
    gameState = gameStateNew;
  }
  getGameState() {
    return gameState;
  }
  getBoard() {
    return gameState.board;
  }
  generateTile() {
    let newNumber = Math.random();
    if (newNumber < 0.1) {
      newNumber = 4;
    } else {
      newNumber = 2;
    }
    let emptySpaces = [];
    for (let i = 0; i < gameState.board.length; i++) {
      if (gameState.board[i] == 0) {
        emptySpaces.push(i);
      }
    }
    let location = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
    gameState.board[location] = newNumber;
  }
  onMove(callback) {
    onMoveObservers.push(callback);
  }

  onWin(callback) {
    onWinObservers.push(callback);
  }

  onLose(callback) {
    onLoseObservers.push(callback);
  }
  //helper that translates strings to seperate functions
  move(input) {
    let copy = [...gameState.board];
    if (input == "right") {
      this.moveRight();
    } else if (input == "left") {
      this.moveLeft();
    } else if (input == "up") {
      this.moveUp();
    } else if ((input = "down")) {
      this.moveDown();
    }

    if (JSON.stringify(copy) != JSON.stringify(gameState.board)) {
      this.generateTile();
      for (let i = 0; i < onMoveObservers.length; i++) {
        onMoveObservers[i](gameState);
      }
    }
    if (gameState.board.includes(2048)) {
      gameState.won = true;
      for (let i = 0; i < onWinObservers.length; i++) {
        onWinObservers[i](gameState);
      }
    }
    // check for loss
    copy = [...gameState.board];
    let theRealScore = gameState.score;
    this.moveRight();
    if (JSON.stringify(copy) == JSON.stringify(gameState.board)) {
      this.moveLeft();
      if (JSON.stringify(copy) == JSON.stringify(gameState.board)) {
        this.moveDown();
        if (JSON.stringify(copy) == JSON.stringify(gameState.board)) {
          this.moveUp();
          if (JSON.stringify(copy) == JSON.stringify(gameState.board)) {
            gameState.over = true;
            for (let i = 0; i < onLoseObservers.length; i++) {
              gameState.score = theRealScore;
              onLoseObservers[i](gameState);
            }
          }
        }
      }
    }
    gameState.score = theRealScore;
    gameState.board = [...copy];
  }
  moveRight() {
    //moves
    let first = true;
    for (let q = 0; q < 2; q++) {
      for (let y = 0; y < size; y++) {
        for (let x = size - 1; x >= 0; x--) {
          let offset = 0;
          if (gameState.board[y * size + x] != 0) {
            while (x + offset + 1 < size) {
              if (gameState.board[y * size + x + offset + 1] == 0) {
                gameState.board[y * size + x + offset + 1] =
                  gameState.board[y * size + x + offset];
                gameState.board[y * size + x + offset] = 0;
              }
              offset++;
            }
          }
        }
      }
      //combines
      if (first) {
        for (let y = 0; y < size; y++) {
          for (let x = size - 1; x > 0; x--) {
            if (
              gameState.board[y * size + x - 1] == gameState.board[y * size + x]
            ) {
              gameState.score += gameState.board[y * size + x - 1] * 2;
              gameState.board[y * size + x] =
                gameState.board[y * size + x - 1] * 2;
              gameState.board[y * size + x - 1] = 0;
            }
          }
        }
        first = false;
      }
    }
  }

  moveLeft() {
    let first = true;
    for (let q = 0; q < 2; q++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          let offset = 0;
          if (gameState.board[y * size + x] != 0) {
            while (x - offset - 1 >= 0) {
              if (gameState.board[y * size + x - offset - 1] == 0) {
                gameState.board[y * size + x - offset - 1] =
                  gameState.board[y * size + x - offset];
                gameState.board[y * size + x - offset] = 0;
              }
              offset++;
            }
          }
        }
      }
      if (first) {
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size - 1; x++) {
            if (
              gameState.board[y * size + x + 1] == gameState.board[y * size + x]
            ) {
              gameState.board[y * size + x] =
                gameState.board[y * size + x + 1] * 2;
              gameState.score += gameState.board[y * size + x + 1] * 2;
              gameState.board[y * size + x + 1] = 0;
            }
          }
        }
        first = false;
      }
    }
  }
  moveUp() {
    let first = true;
    for (let q = 0; q < 2; q++) {
      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          let offset = 0;
          if (gameState.board[y * size + x] != 0) {
            while (y - offset - 1 >= 0) {
              if (gameState.board[(y - offset - 1) * size + x] == 0) {
                gameState.board[(y - offset - 1) * size + x] =
                  gameState.board[(y - offset) * size + x];
                gameState.board[(y - offset) * size + x] = 0;
              }
              offset++;
            }
          }
        }
      }
      if (first) {
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size - 1; y++) {
            if (
              gameState.board[(y + 1) * size + x] ==
                gameState.board[y * size + x] &&
              gameState.board[y * size + x] != 0
            ) {
              gameState.board[y * size + x] =
                gameState.board[(y + 1) * size + x] * 2;
              gameState.score += gameState.board[y * size + x];
              gameState.board[(y + 1) * size + x] = 0;
            }
          }
        }
        first = false;
      }
    }
  }
  moveDown() {
    let first = true;
    for (let q = 0; q < 2; q++) {
      for (let x = 0; x < size; x++) {
        for (let y = size - 1; y >= 0; y--) {
          let offset = 0;
          if (gameState.board[y * size + x] != 0) {
            while (y + offset + 1 < size) {
              if (gameState.board[(y + offset + 1) * size + x] == 0) {
                gameState.board[(y + offset + 1) * size + x] =
                  gameState.board[(y + offset) * size + x];
                gameState.board[(y + offset) * size + x] = 0;
              }
              offset++;
            }
          }
        }
      }
      if (first) {
        for (let x = 0; x < size; x++) {
          for (let y = size - 1; y >= 1; y--) {
            if (
              gameState.board[(y - 1) * size + x] ==
              gameState.board[y * size + x]
            ) {
              gameState.score += gameState.board[y * size + x] * 2;
              gameState.board[y * size + x] = gameState.board[y * size + x] * 2;
              gameState.board[(y - 1) * size + x] = 0;
            }
          }
        }
        first = false;
      }
    }
  }
  toString() {
    let theString = "";
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (gameState.board[y * size + x] == 0) {
          theString = theString.concat("[ ]");
        } else {
          theString = theString.concat(
            "[" + gameState.board[y * size + x] + "]"
          );
        }
      }
      theString = theString.concat("", "\n");
    }

    return theString;
  }
}
