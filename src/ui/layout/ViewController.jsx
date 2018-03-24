import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ControllerButton, { CONTROLLER_BUTTON_PROPTYPES } from './ControllerButton';

export default class ViewController extends Component {
  render() {
    return (
      <div className="view-controller">
        {Object.keys(this.props.elements).map((key) => {
          const element = this.props.elements[key];
          return (
            <ControllerButton
              key={key}
              link={element.link}
              icon={element.icon}
              text={element.text}
            />
          );
        })}
      </div>
    );
  }
}

ViewController.propTypes = {
  elements: PropTypes.objectOf(PropTypes.shape(CONTROLLER_BUTTON_PROPTYPES)).isRequired,
};
