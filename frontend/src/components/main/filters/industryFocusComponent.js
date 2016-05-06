import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';


const industryFocus = [
  { name: 'Consumer & Retail', key: 'consumerRetail' },
  { name: 'Generalist', key: 'generalist' },
  { name: 'Healthcare', key: 'healthcare' },
  { name: 'Tehnology & Software', key: 'tehnologySoftware' }
];

const propTypes = {
  onFilter: PropTypes.func.isRequired
};

class IndustryFocusFiltersComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consumerRetail: false,
      generalist: false,
      healthcare: false,
      tehnologySoftware: false,
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
        {
        industryFocus.map((item, key) =>
          <li key={key}>
            <a
              href="#"
              className={this.getFilterClassName(this.state[item.key])}
              onClick={this.onChange('industry_focus', item.name, item.key)}
            >
              {item.name}
            </a>
          </li>)
        }
      </ul>
    );
  }
}

IndustryFocusFiltersComponent.propTypes = propTypes;


export default IndustryFocusFiltersComponent;
