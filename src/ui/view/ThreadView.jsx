import React, { Component } from 'react';
import PropTypes from 'prop-types';

import getWeb3, { callWeb3Async } from '../../node/web3integration';
import { getThreadContractAt } from '../../contract/contract_util';
import { formatBigNumberTimestamp } from '../human_readable_util';
import { propTypeBigNumber } from '../proptypes_util';

import NewPostForm from './NewPostForm';


const Post = props => (
  <div className="thread-post">
    <p><span className="thread-post-nubmer">{props.number}</span>: <span className="thread-post-poster">{props.poster}</span> <span className="thread-post-timestamp">{formatBigNumberTimestamp(props.timestamp)}</span></p>
    <p>{props.text}</p>
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
      notificationSystem: PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      newPostEvent: null,
    };
  }

  componentWillMount() {
    const thread = getThreadContractAt(this.props.match.params.threadAddress);

    const getAppropriatePostsState = () => {
      if (!this.state || !this.state.posts) {
        return [];
      }

      return this.state.posts;
    };

    const serveContractArrayReturn = (result, attrName) => {
      const posts = getAppropriatePostsState();

      const newPosts = result[0].slice(0, result[1]).map((elem, index) => {
        if (typeof posts[index] === 'undefined') {
          return { [attrName]: elem };
        }

        // State is immutable, objects in array is not copied using Array.slice()
        const copied = Object.assign({}, posts[index]);

        // Set attribute
        copied[attrName] = elem;

        return copied;
      });

      this.setState({
        posts: newPosts,
      });
    };

    // Number of posts are needed for fetching post's data
    callWeb3Async(thread.getNumberOfPosts).then((numberOfPosts) => {
      // this.state.setState({ numberOfPosts: result });

      callWeb3Async(thread.getPosterArray, 0, numberOfPosts).then((postersResult) => {
        serveContractArrayReturn(postersResult, 'poster');
      });

      callWeb3Async(thread.getPostTimestampArray, 0, numberOfPosts).then((timestampsResult) => {
        serveContractArrayReturn(timestampsResult, 'timestamp');
      });

      // Get a post's text individually
      for (let i = 0; i < numberOfPosts; i += 1) {
        callWeb3Async(thread.getPostText, i).then((text) => {
          if (this.state && this.state.posts) {
            // Objects inside an array are not going to be copied using Array.slice()
            const postCopied = Object.assign({}, this.state.posts[i]);

            postCopied.text = text;

            const postsCopied = this.state.posts.slice();

            postsCopied[i] = postCopied;

            this.setState({ posts: postsCopied });
          } else {
            const newPosts = [];

            newPosts[i] = { text };

            this.setState({ posts: newPosts });
          }
        });
      }
    });

    // We can get title if I did not know NOP
    callWeb3Async(thread.getTitle).then(title => this.setState({ title }));

    // Listen to the new post events
    const newPostEvent = thread.NewPost();

    newPostEvent.watch((error, event) => {
      if (error) {
        console.error(error);
        return;
      }

      // Caught event! new post has been made now!
      const newPostsNumberBigNum = event.args.postNumber;

      // Get post data and reflect it
      callWeb3Async(thread.getPostAt.call, newPostsNumberBigNum).then((result) => {
        const newPostsNumber = newPostsNumberBigNum.toNumber();
        const postsCopied = this.state.posts.slice();

        // TODO Have to get posts if we had skipped one

        postsCopied[newPostsNumber] = {
          poster: result[0],
          timestamp: result[1],
          text: result[2],
        };

        this.setState({ posts: postsCopied });
      });
    });

    this.setState({ newPostEvent });
  }

  componentWillUnmount() {
    if (this.state.newPostEvent !== null) {
      // Stop watching to event, cant use callWeb3Async for some reason
      this.state.newPostEvent.stopWatching((error) => { if (error) console.error(error); });
    }
  }

  render() {
    if (!this.state || typeof this.state.posts === 'undefined') {
      return ('loading');
    }

    const title = this.state.title ? this.state.title : '';

    return (
      <div className="view">
        <div className="content thread">
          <p>{title}</p>
          <div className="thread-postlist">
            {this.state.posts.map((post, index) => {
              const poster = post.poster || '';
              const timestamp = post.timestamp || new (getWeb3()).BigNumber(0);
              const text = post.text || '';

              return (<Post
                key={getWeb3().sha3(index.toString(10).concat(poster).concat(timestamp).concat(text))}
                number={index}
                poster={poster}
                timestamp={timestamp}
                text={text}
              />);
            })}
          </div>
          <NewPostForm
            threadAddress={this.props.match.params.threadAddress}
            notificationSystem={this.props.notificationSystem}
          />
        </div>
      </div>
    );
  }
}

