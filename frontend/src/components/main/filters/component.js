import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import objectAssign from 'object-assign';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as MainActions from '../../../actions/main';
import RatingFiltersComponent from './ratingComponent';
import RegionFiltersComponent from './regionComponent';
import InvestmentStartegyFiltersComponent from './investmentStrategyComponent';
import IndustryFocusFiltersComponent from './industryFocusComponent';
import AUMFiltersComponent from './aumComponent';


const propTypes = {
  getPeManagers: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired
};


class FiltersMainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFilterRating: false,
      openFilterCountry: false,
      openFilterRegion: false,
      openFilterInvestmentStrategy: false,
      openFilterIndustryFocus: false,
      openAUM: false,
      orderedKey: 'rating',
      direction: '-',
      currentPage: 1
    };
    this.openFilter = this.openFilter.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onSearchCountry = this.onSearchCountry.bind(this);
    this.getPeManagers = this.getPeManagers.bind(this);
  }

  onSearchCountry(event) {
    if (this.state.searchTimeoutId) {
      clearTimeout(this.state.searchTimeoutId);
    }
    const searchValue = event.target.value;
    const searchTimeoutId = setTimeout(() => {
      this.getPeManagers(
        1, this.state.orderedKey, true, this.state.direction, this.props.filters
      );
    }, 600);
    this.setState({ searchTimeoutId, search: searchValue });
  }

  onFilter(name, value, add) {
    const newFilters = objectAssign({}, this.props.filters);
    if (add) {
      if (newFilters[name]) {
        newFilters[name] += `,${value}`;
      } else {
        newFilters[name] = value;
      }
    } else {
      const valueArr = newFilters[name].toString().split(',');
      valueArr.splice(valueArr.indexOf(value), 1);
      newFilters[name] = valueArr.join(',');
    }
    this.getPeManagers(
      1, this.state.orderedKey, true, this.state.direction, newFilters
    );
  }

  getPeManagers(page, ordering, sort, direction, filters) {
    this.props.getPeManagers(page, ordering, sort, direction, this.state.search, filters);
    this.setState({ orderedKey: ordering, currentPage: page, direction });
  }


  getFilterClassName(filterState) {
    return classnames({
      'md md-remove': filterState,
      'md md-add': !filterState
    });
  }

  getFilterClassNameSubdrop(filterState) {
    return classnames({
      'waves-effect subdrop': filterState,
      'waves-effect': !filterState
    });
  }

  openFilter(item) {
    return (ev) => {
      ev.preventDefault();
      const stateObj = {};
      stateObj[item] = !this.state[item];
      this.setState(stateObj);
    };
  }

  render() {
    return (
      <div className="col-sm-2 left-panel">
        <div className="panel panel-default panel-fill" >
          <div className="panel-heading">
            <h3 className="panel-title"> Filters </h3>
          </div>
          <div className="panel-body slimscrollleft">
          <div id="sidebar-menu">
          <ul>
            <li className="has_sub">
              <a href="#"
                onClick={this.openFilter('openFilterRating')}
                className={this.getFilterClassNameSubdrop(this.state.openFilterRating)}
              >
                <span> Rating </span>
                <span className="pull-right">
                <i className={this.getFilterClassName(this.state.openFilterRating)}></i>
                </span>
              </a>
              <RatingFiltersComponent
                style={!this.state.openFilterRating ? { display: 'none' } : { display: 'block' }}
                onFilter={this.onFilter}
              />
            </li>
            <li className="has_sub">
              <a href="#"
                onClick={this.openFilter('openFilterCountry')}
                className={this.getFilterClassNameSubdrop(this.state.openFilterCountry)}
              >
                <span> Country </span>
                <span className="pull-right">
                <i className={this.getFilterClassName(this.state.openFilterCountry)}></i>
                </span>
              </a>
              <div className={!this.state.openFilterCountry ? 'hide' : ''}>
                <input type="search" className="form-control input-lg"
                  placeholder="Look for a country"
                  onChange={this.onSearchCountry}
                />
              </div>
            </li>
            <li className="has_sub">
              <a href="#"
                onClick={this.openFilter('openFilterRegion')}
                className={this.getFilterClassNameSubdrop(this.state.openFilterRegion)}
              >
                <span> Region </span>
                <span className="pull-right">
                <i className={this.getFilterClassName(this.state.openFilterRegion)}></i>
                </span>
              </a>
              <RegionFiltersComponent
                style={!this.state.openFilterRegion ? { display: 'none' } : { display: 'block' }}
                onFilter={this.onFilter}
              />
            </li>
            <li className="has_sub">
              <a href="#"
                onClick={this.openFilter('openFilterInvestmentStrategy')}
                className={this.getFilterClassNameSubdrop(this.state.openFilterInvestmentStrategy)}
              >
                <span> Investment Strategy </span>
                <span className="pull-right">
                <i className={this.getFilterClassName(this.state.openFilterInvestmentStrategy)}></i>
                </span>
              </a>
              <InvestmentStartegyFiltersComponent
                style={!this.state.openFilterInvestmentStrategy ?
                 { display: 'none' } : { display: 'block' }}
                onFilter={this.onFilter}
              />
            </li>
            <li className="has_sub">
              <a href="#"
                onClick={this.openFilter('openFilterIndustryFocus')}
                className={this.getFilterClassNameSubdrop(this.state.openFilterIndustryFocus)}
              >
                <span> Industry focus </span>
                <span className="pull-right">
                <i className={this.getFilterClassName(this.state.openFilterIndustryFocus)}></i>
                </span>
              </a>
              <IndustryFocusFiltersComponent
                style={!this.state.openFilterIndustryFocus ?
                 { display: 'none' } : { display: 'block' }}
                onFilter={this.onFilter}
              />
            </li>
            <li className="has_sub">
              <a href="#"
                onClick={this.openFilter('openAUM')}
                className={this.getFilterClassNameSubdrop(this.state.openAUM)}
              >
                <span> Assests under management </span>
                <span className="pull-right">
                <i className={this.getFilterClassName(this.state.openAUM)}></i>
                </span>
              </a>
              <AUMFiltersComponent
                style={!this.state.openAUM ? { display: 'none' } : { display: 'block' }}
                onFilter={this.onFilter}
              />
            </li>
          </ul>
          <div className="clearfix"></div>
          </div>
          </div>
        </div>
      </div>
    );
  }
}

FiltersMainComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    filters: state.main.filters
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MainActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FiltersMainComponent);
