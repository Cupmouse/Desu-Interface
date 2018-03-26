import React, { Component } from 'react';
import PropTypes from 'prop-types';

import getWeb3 from '../../web3integration';
import { getThreadContractAt } from '../../contract/contract_util';
import { formatBigNumberTimestamp } from '../human_readable_util';
import { propTypeBigNumber } from '../proptypes_util';

import NewPostForm from '../layout/NewPostForm';


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

    const serveContractArrayReturn = (error, result, attrName) => {
      if (error) {
        console.error(error);
        return;
      }

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
    thread.getNumberOfPosts.call((error, numberOfPosts) => {
      console.log('got nop');
      if (error) {
        console.error(error);
        return;
      }

      thread.getPosterArray.call(0, numberOfPosts, (error2, postersResult) => {
        serveContractArrayReturn(error2, postersResult, 'poster');
      });

      thread.getPostTimestampArray.call(0, numberOfPosts, (error2, timestampsResult) => {
        serveContractArrayReturn(error2, timestampsResult, 'timestamp');
      });

      // Get a post's text individually
      for (let i = 0; i < numberOfPosts; i += 1) {
        thread.getPostText.call(i, (error2, text) => {
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

      // this.state.setState({ numberOfPosts: result });
    });

    // We can get title if I did not know NOP
    thread.getTitle.call((error, result) => {
      if (error) {
        console.error(error);
        return;
      }

      this.setState({ title: result });
    });

    // Listen to the new post events
    const newPostEvent = thread.NewPost();

    newPostEvent.watch((error, event) => {
      if (error) {
        console.error(error);
        return;
      }

      // Caught event! new post has been made now!
      const newPostsNumberBigNum = event.args.postNumber;
      console.log('event catch');

      // Get post data and reflect it
      thread.getPostAt.call(newPostsNumberBigNum, (error1, result) => {
        console.log('post got for event call');
        if (error1) {
          console.error(error1);
          return;
        }

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
  }

  render() {
    console.log('rendering called');
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
          <NewPostForm threadAddress={this.props.match.params.threadAddress} />
        </div>
      </div>
    );
  }
}

