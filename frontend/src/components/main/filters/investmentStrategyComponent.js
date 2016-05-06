import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

const investStrategy = [
  { name: 'Buyout', key: 'buyout' },
  { name: 'Fund of Funds', key: 'fOfF' },
  { name: 'Growth', key: 'growth' },
  { name: 'Hedge Fund', key: 'hedgeFund' },
  { name: 'Infrastructure', key: 'infrastructure' },
  { name: 'Secondaries', key: 'secondaries' },
  { name: 'Venture', key: 'venture' }
];

const propTypes = {
  onFilter: PropTypes.func.isRequired
};

class InvestmentStrategyFiltersComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buyout: false,
      fOfF: false,
      growth: false,
      hedgeFund: false,
      infrastructure: false,
      secondaries: false,
      venture: false,
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
        investStrategy.map((item, key) =>
          <li key={key}>
            <a
              href="#"
              className={this.getFilterClassName(this.state[item.key])}
              onClick={this.onChange('investment_strategy', item.name, item.key)}
            >
              {item.name}
            </a>
          </li>)
        }
      </ul>
    );
  }
}

InvestmentStrategyFiltersComponent.propTypes = propTypes;

export default InvestmentStrategyFiltersComponent;
