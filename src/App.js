import { useState } from "react";

function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={`square ${highlight ? "highlight" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningSquares = winnerInfo ? winnerInfo.line : [];
  const isDraw = !winner && squares.every((square) => square !== null);

  const status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "The game is a draw!"
    : `Next player: ${xIsNext ? "X" : "O"}`;

  function renderSquare(i) {
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        highlight={winningSquares.includes(i)}
      />
    );
  }

  const board = [];
  for (let row = 0; row < 3; row++) {
    const rowSquares = [];
    for (let col = 0; col < 3; col++) {
      rowSquares.push(renderSquare(row * 3 + col));
    }
    board.push(
      <div key={row} className="board-row">
        {rowSquares}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleSortOrder() {
    setIsAscending(!isAscending);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === currentMove) {
      description = `You are at move #${move}`;
    } else if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        {move === currentMove ? (
          <span>{description}</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={toggleSortOrder}>
          {isAscending ? "Sort Descending" : "Sort Ascending"}
        </button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}
