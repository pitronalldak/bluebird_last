import React, { Component, PropTypes } from 'react';
const moment = require('moment');
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as MainActions from '../../../actions/main';
import { Link } from 'react-router';

const propTypes = {
  getPeManagers: PropTypes.func.isRequired,
  isAuth: PropTypes.bool.isRequired,
  isFetchingPeManager: PropTypes.bool.isRequired,
  noMorePeManager: PropTypes.bool.isRequired,
  peManagers: PropTypes.array.isRequired,
  search: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired
};

class ItemMainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderedKey: 'rating',
      currentPage: 1

    };
    this.getPeManagers = this.getPeManagers.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentWillMount() {
    this.getPeManagers(1, 'rating', true, '-');
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  getPeManagers(page, ordering, sort, direction) {
    this.props.getPeManagers(
      page, ordering, sort, direction, this.props.search, this.props.filters
    );
    this.setState({ orderedKey: ordering, currentPage: page, direction });
  }

  handleScroll(event) {
    const body = document.body;
    const html = document.documentElement;
    const scrollTop = event.srcElement.body.scrollTop;
    const scrollHeight = Math.max(body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight);
    if (scrollTop + window.innerHeight > (0.9 * scrollHeight)) {
      if (!this.props.isFetchingPeManager && !this.props.noMorePeManager) {
        this.getPeManagers(this.state.currentPage + 1,
          this.state.orderedKey,
          false,
          this.state.direction,
        );
      }
    }
  }

  handleSort() {
    let ordering = undefined;
    if (this.refs.sort.value === 'rating') {
      this.setState({ orderedKey: 'rating' });
      ordering = 'rating';
    }
    if (this.refs.sort.value === 'dateCreate') {
      this.setState({ orderedKey: 'dateCreate' });
      ordering = 'dateCreate';
    }
    this.props.getPeManagers(
      this.state.page,
      ordering,
      true,
      this.state.direction,
      this.state.search,
      this.props.filters
    );
  }

  render() {
    const path = require('../../../assets/images/users/avatar-1.jpg');
    return (
        <div className="col-sm-8 main-panel">
          <div className="row">
            <div className="col-sm-12 content-header">
              <h5 className="pull-left page-title">
                Listing {this.props.peManagers.length } items
              </h5>
              <div className="pull-right">
                <label>sort by: </label>
                <div className="btn-group">
                  <select
                    className="btn btn-default dropdown-toggle waves-effect"
                    ref="sort"
                    onChange={this.handleSort}
                    defaultValue="rating"
                  >
                    <option value="rating">Rating</option>
                    <option value="dateCreate">Date</option>
                  </select>
                </div>
              </div>
            </div>

          {
            this.props.peManagers.map((item) =>
              <div key={item.id} className="col-sm-12">
                <div className="mini-stat clearfix bx-shadow bg-white">
                <div className="col-sm-1">
                    <img className="user-photo" src={path} />
                </div>
                  <div className="col-sm-11">
                    <div className="col-sm-12">
                      <div className="pull-left">
                        <h4>
                        <Link to={`/peManager/${item.id}`}>{item.name}</Link>
                        </h4>
                        <fieldset className="rating">
                          {Array.apply(null, { length: item.rating }).map((item1, key) =>
                            (<label key={key} className="full" title="Awesome - 5 stars"></label>)
                            )
                          }
                        </fieldset>
                        <p className="review-count">{item.countReviews} Reviews</p>
                      </div>
                      <div className="pull-right invest">
                        <h5>{item.investmentStrategy}</h5>
                        <p>{item.region},{item.country}</p>
                      </div>
                    </div>
                  {item.reviews.map((reviewItem) =>
                    <div key={reviewItem.id} className="col-sm-12">
                      <p>
                        {reviewItem.title}
                        <span>
                          &nbsp;&nbsp;&nbsp;&nbsp; {moment(reviewItem.dateCreated).fromNow()}
                        </span>
                      </p>
                    </div>
                  )}
                  </div>
                </div>
              </div>
            )
          }
          </div>
        </div>
    );
  }
}

ItemMainComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isAuth: state.profile.isAuth,
    peManagers: state.main.peManagers,
    isFetchingPeManager: state.main.isFetchingPeManager,
    noMorePeManager: state.main.noMorePeManager,
    search: state.main.search,
    filters: state.main.filters
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(MainActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemMainComponent);

