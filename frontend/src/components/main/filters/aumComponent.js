import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';


const propTypes = {
  onFilter: PropTypes.func.isRequired
};

class AUMFiltersComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      more: false,
      less: false
    };
  }

  onChange(name, value, add) {
    return (ev) => {
      ev.preventDefault();
      const stateObj = {};
      stateObj[add] = !this.state[add];
      this.setState(stateObj);
      this.props.onFilter(name, value, stateObj[add]);
    };
  }

  getFilterClassName(state) {
    return classnames({
      'waves-effect subdrop': state,
      'waves-effect': !state
    });
  }

  render() {
    return (
      <ul {...this.props}>
          <li>
            <a
              href="#"
              className={this.getFilterClassName(this.state.more)}
              onClick={this.onChange('aum', true, 'more')}
            >
              >$2 billion
            </a>
          </li>
          <li>
            <a
              href="#"
              className={this.getFilterClassName(this.state.less)}
              onClick={this.onChange('aum', false, 'less')}
            >
              $2 billion
            </a>
          </li>
      </ul>
    );
  }
}

AUMFiltersComponent.propTypes = propTypes;

export default AUMFiltersComponent;
