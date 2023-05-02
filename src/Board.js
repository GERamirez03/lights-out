import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.25 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let y = 0; y < nrows; y++) {
      let row = [];
      for (let x = 0; x < ncols; x++) {
        let chance = Math.random();
        let bool = (chance < chanceLightStartsOn);
        row.push(bool);
      }
      initialBoard.push(row);
    }
    return initialBoard;
  }

  function hasWon() {
    let flatBoard = [].concat(...board);
    return flatBoard.every((isLit) => !isLit);
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number); // coord is "y-x"

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // Make a (deep) copy of the oldBoard
      const copyBoard = structuredClone(oldBoard);

      // in the copy, flip this cell and the cells around it

      // cell
      flipCell(y, x, copyBoard);

      // cell above
      flipCell(y-1, x, copyBoard);

      // cell below
      flipCell(y+1, x, copyBoard);

      // left cell
      flipCell(y, x-1, copyBoard);

      // right cell
      flipCell(y, x+1, copyBoard);

      // return the copy
      return copyBoard;
    });
  }

  // if the game is won, just show a winning msg & render nothing else

  if (hasWon()) return <div>You win!</div>;

  // make table board

  let gameBoard = [];

    for (let y = 0; y < nrows; y++) {
      let row = [];

      for (let x = 0; x < ncols; x++) {
        let coord = `${y}-${x}`;

        row.push(
          <Cell
            key={coord}
            isLit={board[y][x]}
            flipCellsAroundMe={() => flipCellsAround(coord)}
          />
        );
      }
      gameBoard.push(<tr key={y}>{row}</tr>);
    }

  return (
    <table className="Board">
      <tbody>{gameBoard}</tbody>
    </table>
  );
}

export default Board;
