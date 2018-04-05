import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

export const CONTROLLER_BUTTON_PROPTYPES = {
  // instanceof IconDefinition but whatever
  icon: PropTypes.instanceOf(Object).isRequired,
  text: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  // clicked: PropTypes.oneOf([{
  //   func: PropTypes.func.isRequired,
  // }, {
  //   link: PropTypes.string.isRequired,
  // }]).isRequired,
};

export default class Button extends Component {
  static get propTypes() {
    return CONTROLLER_BUTTON_PROPTYPES;
  }

  // buttonPressed(event) {
  //   const clickedObj = this.props.clicked;
  //
  //   if (typeof clickedObj.func === 'undefined') {
  //     // Call listener
  //     clickedObj.func(event);
  //   } else if (typeof clickedObj.link === 'undefined') {
  //     // Do nothing
  //
  //   } else {
  //     // Wat not one of them?
  //   }
  // }
  // onClick={event => this.buttonPressed(event)}

  render() {
    return (
      <Link to={this.props.link}>
        <div className="view-controller-button">
          <FontAwesomeIcon icon={this.props.icon} size="3x" />
          <p>{this.props.text}</p>
        </div>
      </Link>
    );
  }
}
