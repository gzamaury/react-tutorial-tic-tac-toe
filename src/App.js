import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {return;}

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const jsxSquares = squares.map((currSquare, i, squares) =>
    <Square value={currSquare} onSquareClick={() => handleClick(i)} />
  );

  const jsxRowsBoard = [];
  const numSquaresByRow = 3;
  for (let i = 0; i < jsxSquares.length; i += numSquaresByRow) {
    jsxRowsBoard.push(
      <div className="board-row">
        {jsxSquares.slice(i, i + numSquaresByRow)}
      </div>
    );
  }

  return (
    <div>
      <div className="status">{status}</div>
      { jsxRowsBoard }
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currenMove, setCurrenMove] = useState(0); 
  const xIsNext = currenMove % 2 === 0;
  const currentSquares = history[currenMove];
  
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currenMove + 1), nextSquares];
    setHistory(nextHistory)
    setCurrenMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrenMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    let isFirstMove = history.length === 1;
    let isCurrentMove = move === currenMove; 
    if (move === 0) {
      description = isFirstMove ? 
        'Starting the game' :
          isCurrentMove ?
          'You are at the start' :
          'Go to game start' ;
    } else if (move < currenMove) {
      description = 'Go to move #' + move;
    } else {
      description = 'You are at move #' + move;
    }
    return (
      <li key={move}>
        { isCurrentMove ? (
          <span>{description}</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
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
  
  for (let i = 0; i<lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  };

  return null;
}
