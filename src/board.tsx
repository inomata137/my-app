import React from 'react';
import { Marker } from '.'
import { Square } from './square'
import './index.css';

type BoardProps = {
  squares: Marker[];
  isX: boolean;
  onClick: (i: number) => void;
  winnerLine: number[];
}

export class Board extends React.Component<BoardProps> {
  renderSquare(i: number) {
    const isWinnersSquare = this.props.winnerLine.includes(i)
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinnersSquare={isWinnersSquare}
      />
    );
  }

  renderRow(rowIndex: number) {
    const mapRow = (_: undefined, colIndex: number) => {
      return this.renderSquare(rowIndex * 3 + colIndex)
    }
    return (
      <div
        key={rowIndex}
        className='board-row'
      >
        {[...Array(3)].map(mapRow)}
      </div>
    )
  }

  render() {
    const mapBoard = (_: undefined, rowIndex: number) => {
      return this.renderRow(rowIndex)
    }
    return (
      <div>
        {[...Array(3)].map(mapBoard)}
      </div>
    );
  }
}

