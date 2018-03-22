import React from 'react';
import PropTypes from 'prop-types';

export default class ThreadList extends React.Component {
  static get propTypes() {
    return {
      threads: PropTypes.arrayOf(PropTypes.string).isRequired,
    };
  }

  render() {
    return this.props.threads.map((thread) => {
      return (<div key={thread}>{thread}</div>);
    });
  }
}
