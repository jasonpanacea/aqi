import React from 'react';

export default class SubItemComponent extends React.Component {
  render() {
    return (
      <span>{this.props.pollution}<sub>{this.props.sub}</sub></span>
    );
  }
}
