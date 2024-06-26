import { useState } from "react";

function Square({ value, onSquareClick, className }) {
  return (
    <button className={className}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, isLastMove }) {
  const rowColMap = [
    "(1,1)", "(1,2)", "(1,3)",
    "(2,1)", "(2,2)", "(2,3)",
    "(3,1)", "(3,2)", "(3,3)"
  ];
  const {winner, winnerLine} = calculateWinner(squares);
  
  function handleClick(i) {
    if (squares[i] || winner) {return;}

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    nextSquares[9] = rowColMap[i];
    onPlay(nextSquares);
  }

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (isLastMove) {
    status = "It's a draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const jsxSquares = squares.map((currSquare, i, squares) => {
    const isAWinner = winnerLine.includes(i);

    return <Square value={currSquare} onSquareClick={() => handleClick(i)}
      className={isAWinner ? "square winner" : "square" } />
  });

  const jsxRowsBoard = [];
  const numSquaresByRow = 3;
  for (let i = 0; i < 9; i += numSquaresByRow) {
    jsxRowsBoard.push(
      <div className="board-row">
        {jsxSquares.slice(i, i + numSquaresByRow)}
      </div>
    );
  }

  return (
    <div>
      <div className={ winner ? "status winner" : "status"}>{status}</div>
      { jsxRowsBoard }
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(10).fill(null)]);
  const [currenMove, setCurrenMove] = useState(0); 
  const [reversed, setReversed] = useState(false);
  
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

  let isLastMove = history.length > 9;

  let moves = history.map((squares, move) => {
    let description;
    let isFirstMove = history.length === 1;
    let isCurrentMove = move === currenMove; 

    if (move === 0) {
      description = isFirstMove ? 
        'Starting the game' :
          isCurrentMove ?
          'You are at the start' :
          'Go to game start' ;
    } else if (move !== currenMove) {
      description = 'Go to move #' + move + ' > ' + squares[9];
    } else {
      description = 'You are at move #' + move + ' > ' + squares[9];
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

  moves = reversed ? moves.reverse() : moves ;

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} isLastMove={isLastMove} />
      </div>
      <div className="game-info">
        <div className="btnReverse">
          <button onClick={() => setReversed(!reversed)} disabled={history.length === 1} >
            { !reversed ? "Show in descending order" : "Show in ascending order" }
          </button>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  let winner = null;
  let winnerLine = [];
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
      winner = squares[a];
      winnerLine = [a, b, c];
      break;
    }
  };

  return {winner, winnerLine};
}
