import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getThreadContractAt } from '../../contract/contract_util';
import { propTypeBigNumber } from '../proptypes_util';
import getWeb3 from '../../web3integration';
import { formatBigNumberTimestamp } from '../human_readable_util';
import ViewController from '../layout/ViewController';
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

  constructor(props) {
    super(props);
    this.state = {
      newPostText: '',
    };

    this.onTextChange = this.onTextChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);

  //   this.controllerElements = {
  //     newPost: {
  //       link: genPathToNewPost(props.match.params.threadAddress),
  //     }
  //   }
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

    thread.getTitle.call((error, result) => {
      if (error) {
        console.error(error);
        return;
      }

      this.setState({ title: result });
    });

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

        const [
          postersCopied,
          timestampsCopied,
          textsCopied,
        ] =
          [
            this.state.posters.slice(),
            this.state.timestamps.slice(),
            this.state.texts.slice(),
          ];

        [
          postersCopied[newPostsNumber],
          timestampsCopied[newPostsNumber],
          textsCopied[newPostsNumber],
        ] = result;


        // If more than 2 posts are posted in the same block
        // order of events called is not always the order of posts included in the block (I guess)
        let afterSmallestNOP = newPostsNumber + 1;

        if (afterSmallestNOP < this.state.smallestNOP) {
          afterSmallestNOP = this.state.smallestNOP;
        }

        this.setState({
          posters: postersCopied,
          timestamps: timestampsCopied,
          texts: textsCopied,
          smallestNOP: afterSmallestNOP,
        });
      });
    });
  }

  onTextChange(event) {
    this.setState({ newPostText: event.target.value });
  }

  onFormSubmit(event) {
    event.preventDefault();

    const thread = getThreadContractAt(this.props.match.params.threadAddress);

    thread.post.estimateGas(this.state.newPostText, (error, estimate) => {
      if (error) {
        console.error(error);
        return;
      }

      // Test if it can run without problems on vm
      thread.post.call(this.state.newPostText, (error2) => {
        if (error2) {
          console.error(error2);
          return;
        }

        // It can, send real tx

        getWeb3().eth.getAccounts((error3, accounts) => {
          thread.post(this.state.newPostText, {
            from: accounts[0],
            gas: estimate,
          }, (error4, txHash) => {
            if (error4) {
              console.error(error4);
            } else {
              console.log(txHash);
            }

            this.setState({ newPostText: '' });
          });
        });
      });
    });
  }

  renderPosts() {
    console.log('rendering posts');
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
    console.log('rendering called');
    if (!this.state || typeof this.state.smallestNOP === 'undefined') {
      return ('loading');
    }

    const title = this.state.title ? this.state.title : '';

    return (
      <div className="view">
        <div className="content thread">
          <p>{title}</p>
          <div className="thread-postlist">
            {this.renderPosts()}
          </div>
          <div className="new-post-wrapper">
            <form onSubmit={this.onFormSubmit}>
              <textarea className="new-post-text" placeholder="Write your thoughts here..." value={this.state.newPostText} onChange={this.onTextChange} />
              <input type="submit" value="Send" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

