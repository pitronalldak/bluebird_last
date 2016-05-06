import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';


const propTypes = {
  onFilter: PropTypes.func.isRequired
};


class RatingFiltersComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      five: false,
      four: false,
      three: false,
      two: false,
      one: false,
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
      <ul {...this.props} className="list-unstyled">
        <li>
          <div className="checkbox checkbox-primary star-check">
            <input
              id="checkbox5" checked={this.state.five}
              onChange={this.onChange('rating', 5, 'five')}
              type="checkbox"
            />
              <label htmlFor="checkbox5">
                <fieldset className="rating">
                  <label className="full" htmlFor="checkbox5" title=""></label>
                  <label className="full" htmlFor="checkbox5" title=""></label>
                  <label className="full" htmlFor="checkbox5" title=""></label>
                  <label className="full" htmlFor="checkbox5" title=""></label>
                  <label className="full" htmlFor="checkbox5" title=""></label>
                </fieldset>
            </label>
          </div>
        </li>
        <li>
          <div className="checkbox checkbox-primary star-check">
            <input
              id="checkbox4" checked={this.state.four}
              onChange={this.onChange('rating', 4, 'four')}
              type="checkbox"
            />
              <label htmlFor="checkbox4">
                <fieldset className="rating">
                  <label className="full" htmlFor="checkbox4" title=""></label>
                  <label className="full" htmlFor="checkbox4" title=""></label>
                  <label className="full" htmlFor="checkbox4" title=""></label>
                  <label className="full" htmlFor="checkbox4" title=""></label>
                </fieldset>
            </label>
          </div>
        </li>
        <li>
          <div className="checkbox checkbox-primary star-check">
            <input
              id="checkbox3" checked={this.state.three}
              onChange={this.onChange('rating', 3, 'three')}
              type="checkbox"
            />
              <label htmlFor="checkbox3">
                <fieldset className="rating">
                  <label className="full" htmlFor="checkbox3" title=""></label>
                  <label className="full" htmlFor="checkbox3" title=""></label>
                  <label className="full" htmlFor="checkbox3" title=""></label>
                </fieldset>
            </label>
          </div>
        </li>
        <li>
          <div className="checkbox checkbox-primary star-check">
            <input
              id="checkbox2" checked={this.state.two}
              onChange={this.onChange('rating', 2, 'two')}
              type="checkbox"
            />
              <label htmlFor="checkbox2">
                <fieldset className="rating">
                  <label className="full" htmlFor="checkbox2" title=""></label>
                  <label className="full" htmlFor="checkbox2" title=""></label>
                </fieldset>
            </label>
          </div>
        </li>
        <li>
          <div className="checkbox checkbox-primary star-check">
            <input
              id="checkbox1" checked={this.state.one}
              onChange={this.onChange('rating', 1, 'one')}
              type="checkbox"
            />
              <label htmlFor="checkbox1">
                <fieldset className="rating">
                  <label className="full" htmlFor="checkbox1" title=""></label>
                </fieldset>
            </label>
          </div>
        </li>
      </ul>
    );
  }
}

RatingFiltersComponent.propTypes = propTypes;

export default RatingFiltersComponent;
