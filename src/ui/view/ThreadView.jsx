import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getThreadContractAt } from '../../contract/contract_util';
import { propTypeBigNumber } from '../proptypes_util';
import getWeb3 from '../../web3integration';

const Post = (props) => (<div className="thread-post">{props.poster}</div>);

Post.proptypes = {
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
          from: PropTypes.string.isRequired,
          goal: PropTypes.string,
        }).isRequired,
      }).isRequired,
    };
  }

  componentWillMount() {
    const thread = getThreadContractAt(this.props.match.params.threadAddress);

    Promise.all([
      thread.getPosterArray.call(0, 50),
      thread.getPostTimestampArray.call(0, 50),
      thread.getPostTextArray.call(0, 50),
    ]).then((responses) => {
      const [postersResponse, timestampsResponse, textsResponse] = responses;

      // Returned posts number can be changed by timing,
      // only use data which all post properties are fetched
      const smallestNOP = Math.min(postersResponse[1], timestampsResponse[1], textsResponse[1]);

      const posts = [];

      for (let i = 0; i < smallestNOP; i += 1) {
        posts.push({
          poster: postersResponse[0][i],
          timestamp: timestampsResponse[0][i],
          text: textsResponse[0][i],
        });
      }

      this.setState({ posts });
    });
  }

  render() {
    if (this.state == null) {
      return ('loading');
    }

    return (
      <div>
        {this.state.posts.map((post, index) => (
          <Post
            key={getWeb3().sha3(index.toString(10).concat(post.poster).concat(post.timestamp))}
            poster={post.poster}
            timestamp={post.timestamp}
            text={post.text}
          />
          ))}
      </div>
    );
  }
}

