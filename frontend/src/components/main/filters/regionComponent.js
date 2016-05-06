import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

const region = [
  { name: 'Asia pacific', key: 'asia' },
  { name: 'Europe', key: 'europe' },
  { name: 'Middle East & Africa', key: 'eastAfrica' },
  { name: 'North America', key: 'NAmerica' },
  { name: 'South America', key: 'SAmerica' }
];

const propTypes = {
  onFilter: PropTypes.func.isRequired
};


class RegionFiltersComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      asia: false,
      europe: false,
      eastAfrica: false,
      NAmerica: false,
      SAmerica: false,
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
        region.map((item, key) =>
          <li key={key}>
            <a
              href="#"
              className={this.getFilterClassName(this.state[item.key])}
              onClick={this.onChange('region', item.name, item.key)}
            >
              {item.name}
            </a>
          </li>)
        }
      </ul>
    );
  }
}

RegionFiltersComponent.propTypes = propTypes;

export default RegionFiltersComponent;
