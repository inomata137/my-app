import React from 'react';
import ReactDOM from 'react-dom';
import { Board } from './board';
import './index.css';

export type Marker = 'X' | 'O' | null

type Diff = {
  position: number;
  marker: NonNullable<Marker>;
}

type GameState = {
  history: Marker[][];
  isX: boolean;
  current: number;
  diffs: Diff[];
  reverse: boolean;
}
class Game extends React.Component<{}, GameState> {
  constructor(props: {}) {
    super(props)
    const square = Array(9).fill(null)
    this.state = {
      history: [square],
      isX: false,
      current: 0,
      diffs: [],
      reverse: false,
    }
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.current + 1)
    const squares = [...history[history.length - 1]]

    if (checkWinner(squares).winner) return
    if (squares[i]) return

    squares[i] = this.state.isX ? 'X' : 'O'
    const newHistory = [...history, squares]
    const current = newHistory.length - 1
    const newDiff: Diff = {
      position: i,
      marker: current % 2 ? 'O' : 'X',
    }
    const oldDiffs = this.state.diffs.slice(0, this.state.current)
    const diffs = [...oldDiffs, newDiff]
    this.setState({
      history: newHistory,
      current,
      isX: !!(current % 2),
      diffs,
    })
  }

  jumpTo(i: number) {
    this.setState({
      current: i,
      isX: !!(i % 2),
    })
  }

  reverse() {
    const reverse = !this.state.reverse
    this.setState({
      reverse,
    })
  }

  render() {
    const history = [...this.state.history]
    const current = this.state.current
    const squares = history[current]
    const winner = checkWinner(squares)
    const defineStatus = () => {
      if (winner.winner) return `Winner: ${winner.winner}`
      if (winner.draw) return 'Draw'
      return `Next player: ${this.state.isX ? 'X' : 'O'}`;
    }
    const status = defineStatus()

    const moves = history.map((_, move) => {
      const formatDestiny = (m: number) => {
        const diff = this.state.diffs[m - 1]
        const marker = diff.marker
        const position = formatPosition(diff.position)
        return `#${m}: ${marker} at ${position}`
      }
      const destiny = move ? formatDestiny(move): 'game start'
      const desc = 'Go to ' + destiny
      const className = move === this.state.current ? 'bold' : ''
      return (
        <li key={`${move}th-list-item`}>
          <button
            onClick={() => this.jumpTo(move)}
            className={className}
          >{desc}</button>
        </li>
      );
    });
    if (this.state.reverse) {
      moves.reverse()
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={squares}
            winnerLine={winner.line}
            isX={this.state.isX}
            onClick={(i: number) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button
            onClick={() => this.reverse()}
          >Reverse history</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

export function checkWinner(squares: Marker[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (const line of lines) {
    if (!squares[line[0]]) continue
    if (squares[line[0]] !== squares[line[1]]) continue
    if (squares[line[0]] !== squares[line[2]]) continue
    return {
      winner: squares[line[0]],
      line,
      draw: false,
    }
  }
  if (squares.every(square => square)) {
    return {
      winner: null,
      line: [],
      draw: true,
    }
  }
  return {
    winner: null,
    line: [],
    draw: false,
  }
}

function formatPosition(i: number) {
  const row = Math.floor(i / 3)
  const col = i % 3
  return `(${row}, ${col})`
}
