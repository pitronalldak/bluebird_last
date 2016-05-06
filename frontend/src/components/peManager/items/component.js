import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PeManagerActions from '../../../actions/peManager';
import BlockReviewComponent from '../../base/reviewItem/component';

const propTypes = {
  getReview: PropTypes.func.isRequired,
  isAuth: PropTypes.bool.isRequired,
  isFetchingReview: PropTypes.bool.isRequired,
  noMoreReview: PropTypes.bool.isRequired,
  reviews: PropTypes.array.isRequired,
  peManagerId: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

class ItemReviewComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderedKey: 'rating',
      currentPage: 1

    };
    this.getReview = this.getReview.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentWillMount() {
    this.getReview(1, 'rating', true);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  getReview(page, ordering) {
    this.props.getReview(this.props.peManagerId, page, ordering);
    this.setState({ orderedKey: ordering, currentPage: page });
  }

  handleScroll(event) {
    const body = document.body;
    const html = document.documentElement;
    const scrollTop = event.srcElement.body.scrollTop;
    const scrollHeight = Math.max(body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight);
    if (scrollTop + window.innerHeight > (0.9 * scrollHeight)) {
      if (!this.props.isFetchingReview && !this.props.noMoreReview) {
        this.getReview(this.props.peManagerId, this.state.currentPage + 1,
          this.state.orderedKey,
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
    this.getReview(
      this.state.page,
      ordering
    );
  }

  render() {
    return (
        <div className="col-sm-8 main-panel">
          <div className="row">
            <div className="col-sm-12 content-header">
              <h5 className="pull-left page-title">
                Listing {this.props.reviews.length } items
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
              this.props.reviews.map((item) =>
                <BlockReviewComponent key={item.id}
                  review={item}
                  path={this.props.path}
                />
              )
            }
          </div>
        </div>
    );
  }
}

ItemReviewComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isAuth: state.profile.isAuth,
    reviews: state.peManager.reviews,
    isFetchingReview: state.peManager.isFetchingReview,
    noMoreReview: state.peManager.noMoreReview,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(PeManagerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemReviewComponent);

