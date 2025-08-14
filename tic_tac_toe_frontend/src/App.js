import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * Calculate the winner of a Tic Tac Toe board.
 * Returns an object with the winner ("X" or "O") and the winning line indices, or null if no winner yet.
 * @param {Array<string|null>} squares - The 9 board positions.
 * @returns {{winner: "X"|"O"|null, line: number[]}}
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

/**
 * Single square (button) on the board.
 * @param {{value: "X"|"O"|null, onClick: () => void, isWinning: boolean, disabled: boolean}} props
 */
function Square({ value, onClick, isWinning, disabled }) {
  const filledClass = value ? ` filled ${value.toLowerCase()}` : '';
  const winClass = isWinning ? ' winning' : '';
  return (
    <button
      type="button"
      className={`square${filledClass}${winClass}`}
      onClick={onClick}
      disabled={disabled || Boolean(value)}
      aria-label={`Board square ${value ? value : 'empty'}`}
    >
      {value}
    </button>
  );
}

/**
 * The 3x3 board grid.
 * @param {{
 *   squares: Array<"X"|"O"|null>,
 *   onSquareClick: (index: number) => void,
 *   winningLine: number[],
 *   disabled: boolean
 * }} props
 */
function Board({ squares, onSquareClick, winningLine, disabled }) {
  return (
    <div className="board" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((val, idx) => (
        <Square
          key={idx}
          value={val}
          onClick={() => onSquareClick(idx)}
          isWinning={winningLine.includes(idx)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * A complete, modern Tic Tac Toe game UI with Player vs Player mode.
 * - Shows current player
 * - Detects winner and draw
 * - Allows resetting the game
 * - Centered layout with controls below the board
 * @returns {JSX.Element} The application UI.
 */
function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line: winningLine } = useMemo(
    () => calculateWinner(squares),
    [squares]
  );

  const isBoardFull = useMemo(
    () => squares.every(Boolean),
    [squares]
  );

  const isDraw = !winner && isBoardFull;
  const gameOver = Boolean(winner) || isDraw;

  const currentPlayer = xIsNext ? 'X' : 'O';

  const statusText = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "It's a draw!"
    : `Current player: ${currentPlayer}`;

  const handleSquareClick = (index) => {
    if (squares[index] || gameOver) return;
    const next = squares.slice();
    next[index] = currentPlayer;
    setSquares(next);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="App">
      <main className="game-container">
        <section className="game-card" aria-labelledby="game-title">
          <h1 id="game-title" className="title">Tic Tac Toe</h1>

          <div className="status" aria-live="polite">
            {statusText}
          </div>

          <Board
            squares={squares}
            onSquareClick={handleSquareClick}
            winningLine={winningLine}
            disabled={Boolean(winner)}
          />

          <div className="controls">
            <button
              type="button"
              className="btn"
              onClick={resetGame}
              aria-label="Reset the game"
            >
              Play Again
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
