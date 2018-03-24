import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getThreadContractAt } from '../../contract/contract_util';
import { propTypeBigNumber } from '../proptypes_util';
import getWeb3 from '../../web3integration';
import { formatBigNumberTimestamp } from '../human_readable_util';

const Post = props => (
  <div className="thread-post">
    <p><span className="thread-post-nubmer">{props.number}</span>: <span className="thread-post-poster">{props.poster}</span> <span className="thread-post-timestamp">{formatBigNumberTimestamp(props.timestamp)}</span></p>
    {props.text}
  </div>
);

Post.propTypes = {
  number: PropTypes.number.isRequired,
  poster: PropTypes.string.isRequired,
  timestamp: propTypeBigNumber.isRequired,
  text: PropTypes.string.isRequired,
};

export default class ThreadView extends Component {
  static get propTypes() {
    return {
      match: PropTypes.shape({
        params: PropTypes.shape({
          threadAddress: PropTypes.string.isRequired,
          from: PropTypes.string,
          goal: PropTypes.string,
        }).isRequired,
      }).isRequired,
    };
  }

  componentWillMount() {
    const thread = getThreadContractAt(this.props.match.params.threadAddress);

    const startFetchingTextIfNOPIsKnown = () => {
      if (this.state && this.state.posters && this.state.timestamps) {
        // All things we need are fetched

        // Post number can be differ from one array to another
        // We use data only we have
        const smallestNOP = Math.min(
          this.state.posters.length,
          this.state.timestamps.length,
        );

        this.setState({ smallestNOP });

        for (let i = 0; i < smallestNOP; i += 1) {
          thread.getPostText.call(i, (error, result) => {
            if (error) {
              console.error(error);
              return;
            }

            let textsCopied;
            if (!this.state || this.state.texts) {
              textsCopied = this.state.texts.slice();
            } else {
              textsCopied = [];
            }

            textsCopied[i] = result;

            this.setState({
              texts: textsCopied,
            });
          });
        }
      }
    };

    thread.getPosterArray.call(0, 50, (error, result) => {
      if (error) {
        console.error(error);
        return;
      }

      this.setState({
        posters: result[0].slice(0, result[1]),
      });

      // Check after set state
      startFetchingTextIfNOPIsKnown();
    });

    thread.getPostTimestampArray.call(0, 50, (error, result) => {
      if (error) {
        console.error(error);
        return;
      }

      this.setState({
        timestamps: result[0].slice(0, result[1]),
      });

      startFetchingTextIfNOPIsKnown();
    });
  }

  renderPosts() {
    const comp = [];

    for (let i = 0; i < this.state.smallestNOP; i += 1) {
      const poster = this.state.posters[i];
      const timestamp = this.state.timestamps[i];
      // Text could not be there yet
      const text = (!this.state.texts || this.state.texts[i] == null) ? '' : this.state.texts[i];

      comp.push(<Post
        key={getWeb3().sha3(i.toString(10).concat(poster).concat(timestamp).concat(text))}
        number={i}
        poster={poster}
        timestamp={timestamp}
        text={text}
      />);
    }

    return comp;
  }

  render() {
    if (!this.state || typeof this.state.smallestNOP === 'undefined') {
      return ('loading');
    }

    return (
      <div className="content threads">
        {this.renderPosts()}
      </div>
    );
  }
}

