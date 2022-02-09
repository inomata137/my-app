import React from 'react';
import { Marker } from '.'
import './index.css';

export type SquareProps = {
  value: Marker;
  onClick: () => void;
  isWinnersSquare: boolean;
}

export class Square extends React.Component<SquareProps> {
  render() {
    const highlightClass = this.props.isWinnersSquare ? 'highlighted' : ''
    return (
      <button
        className={'square ' + highlightClass}
        onClick={this.props.onClick}
      >
        {this.props.value}
      </button>
    );
  }
}
