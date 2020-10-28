import Game from "./engine/game.js";
var theGame = new Game(4);
export function load2048IntoDOM(theGame) {
  const $root = $("#root");

  let columns = `
  <h1>HOW TO PLAY: Use your arrow keys to move the tiles. Tiles with the same number merge into one when they touch. Add them up to reach 2048!</h1>
  <div id="result"> </div>
  <div id="score"></div>
  <div class="columns">
            <div id="0" class="column">
              <p>First column<p>
            </div>
            <div id="1" class="column">
              Second column
            </div>
            <div id="2" class="column">
              Third column
            </div>
            <div id="3" class="column">
              Fourth column
            </div>
          </div>
          <div class="columns">
            <div id="4" class="column">
              First column
            </div>
            <div id="5" class="column">
              Second column
            </div>
            <div id="6" class="column">
              Third column
            </div>
            <div id="7" class="column">
              Fourth column
            </div>
          </div>
          <div class="columns">
            <div id="8" class="column">
              First column
            </div>
            <div id="9" class="column">
              Second column
            </div>
            <div id="10"class="column">
              Third column
            </div>
            <div id="11" class="column">
              Fourth column
            </div>
          </div>
          <div class="columns">
            <div id="12" class="column">
              First column
            </div>
            <div id="13" class="column">
              Second column
            </div>
            <div id="14" class="column">
              Third column
            </div>
            <div id="15" class="column">
              Fourth column
            </div>
          </div>`;
  $root.append(columns);

  function updateRoot() {
    for (let i = 0; i < 16; i++) {
      document.getElementById(i.toString()).innerHTML = theGame.getBoard()[i];
    }
  }
  updateRoot();
  $(document).keydown(function (input) {
    if (input.keyCode == 39) {
      theGame.move("right");
    } else if (input.keyCode == 37) {
      theGame.move("left");
    } else if (input.keyCode == 38) {
      theGame.move("up");
    } else if ((input.keyCode = 40)) {
      theGame.move("down");
    }
    if (theGame.getGameState().won == true) {
      $(result).html("<h1>YOU WIN</h1>");
    } else if (theGame.getGameState().over == true) {
      $(result).html("<h1>YOU LOSE</h1>");
    }
    $("#score").html(theGame.getGameState().score);
    updateRoot();
  });

  let button = `
<button type="button" id="reset">reset</button>
`;
  $root.append(button);
  $("#reset").on("click", function () {
    theGame.setupNewGame();
    $(result).html("");
    updateRoot();
  });
}

$(function () {
  load2048IntoDOM(theGame);
});
