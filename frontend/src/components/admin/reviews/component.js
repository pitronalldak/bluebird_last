import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Joi from 'joi';

import * as AdminActions from '../../../actions/admin';
import SortHeaderComponent from '../../base/tableSortHeader/component';
import ReviewModal from './reviewModal';
import ConfirmModal from '../../base/confirm/component';


const propTypes = {
  getReviews: PropTypes.func.isRequired,
  rmReview: PropTypes.func.isRequired,
  reviews: PropTypes.array.isRequired,
  isFetchingReviews: PropTypes.bool.isRequired,
  noMoreReviews: PropTypes.bool.isRequired
};

const titleReviews = [
  { name: 'id',
    key: 'id',
    formShow: false,
    tableShow: true,
    type: 'text'
  },
  { name: 'Pemanager',
    key: 'pemanager',
    formShow: false,
    tableShow: true,
    type: 'text'
  },
  { name: 'User',
    key: 'user',
    formShow: false,
    tableShow: true,
    type: 'text'
  },
  { name: 'Rating',
    key: 'rating',
    formShow: true,
    tableShow: true,
    type: 'select',
    choices: [
      '0', '1', '2', '3', '4', '5'
    ]
  },
  { name: 'Title review',
    key: 'title',
    formShow: true,
    tableShow: true,
    validation: Joi.string().allow(''),
    type: 'text'
  },
  { name: 'Review',
    key: 'review',
    formShow: true,
    tableShow: true,
    validation: Joi.string(),
    type: 'text'
  },
  { name: 'Personal Experience',
    key: 'personalExperience',
    formShow: true,
    tableShow: true,
    type: 'select',
    choices: [
      'true', 'false'
    ]
  },
  { name: 'Posted info user',
    key: 'postedInfoUser',
    formShow: true,
    tableShow: true,
    validation: Joi.string(),
    type: 'select',
    choices: ['true', 'false']
  },
  { name: 'Thumbs',
    key: 'thumbs',
    formShow: true,
    tableShow: true,
    validation: Joi.number().integer(),
    type: 'text'
  },
  { name: 'Raport',
    key: 'raport',
    formShow: true,
    tableShow: true,
    type: 'select',
    choices: [
      'true', 'false'
    ]
  },
  { name: 'Is verify',
    key: 'isVerify',
    formShow: true,
    tableShow: true,
    type: 'checkbox'
  },
  { name: 'Data create ',
    key: 'dateCreated',
    formShow: false,
    tableShow: true,
    type: 'text'
  }

];

class ReviewsAdminComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderedKey: 'id',
      searchTimeoutId: null,
      editedReview: null,
      verify: undefined,
      showReviewModal: false,
      currentPage: 1
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.getReviews = this.getReviews.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.editReview = this.editReview.bind(this);
    this.rmReview = this.rmReview.bind(this);
    this.handleVerify = this.handleVerify.bind(this);
  }

  componentWillMount() {
    this.getReviews(1, 'id', true, '-');
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  onSearch(event) {
    if (this.state.searchTimeoutId) {
      clearTimeout(this.state.searchTimeoutId);
    }
    const searchValue = event.target.value;
    const searchTimeoutId = setTimeout(() => {
      this.getReviews(
        1, this.state.orderedKey, true, this.state.direction
      );
    }, 600);
    this.setState({ searchTimeoutId, search: searchValue });
  }

  getReviews(page, ordering, sort, direction) {
    this.props.getReviews(page, ordering, sort, direction, this.state.search, this.state.verify);
    this.setState({ orderedKey: ordering, currentPage: page, direction });
  }

  toggleReviewModal(state) {
    return (ev) => {
      if (ev) {
        ev.preventDefault();
      }
      this.setState({ showReviewModal: state, editedReview: null });
    };
  }

  editReview(review) {
    return (ev) => {
      ev.preventDefault();
      this.setState({ editedReview: review, showReviewModal: true });
    };
  }

  rmReview(review) {
    return () => {
      this.props.rmReview(review.id);
    };
  }

  handleVerify() {
    let verify = undefined;
    if (this.refs.verify.value === 'all') {
      this.setState({ verify: undefined });
    }
    if (this.refs.verify.value === 'verify') {
      this.setState({ verify: true });
      verify = true;
    }
    if (this.refs.verify.value === 'notVerify') {
      this.setState({ verify: false });
      verify = false;
    }
    this.props.getReviews(
      this.state.page,
      this.state.orderedKey,
      true,
      this.state.direction,
      this.state.search,
      verify
    );
  }

  handleScroll(event) {
    const body = document.body;
    const html = document.documentElement;
    const scrollTop = event.srcElement.body.scrollTop;
    const scrollHeight = Math.max(body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight);

    if (scrollTop + window.innerHeight > (0.95 * scrollHeight)) {
      if (!this.props.isFetchingReviews && !this.props.noMoreReviews) {
        this.getReviews(this.state.currentPage + 1,
          this.state.orderedKey,
          false,
          this.state.direction
        );
      }
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="panel panel-default">
            <div className="panel-heading">
              <div className="row">
                <div className="col-sm-1">
                  <h3 className="panel-title">Reviews</h3>
                  <select
                    ref="verify"
                    onChange={this.handleVerify}
                    defaultValue="all"
                  >
                    <option value="all">All</option>
                    <option value="verify">Only verify</option>
                    <option value="notVerify">Not verify</option>
                  </select>
                </div>
                <ReviewModal
                  show={this.state.showReviewModal}
                  review={this.state.editedReview}
                  titleReviews={titleReviews}
                  closeModal={this.toggleReviewModal(false)}
                />
                <form className="form-horizontal col-sm-6">
                  <div className="form-group">
                    <label className="col-sm-3 control-label">Search</label>
                    <div className="col-sm-9">
                      <input type="search" className="form-control input-sm"
                        onChange={this.onSearch}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="panel-body">
              <div className="row">
                <div className="col-md-12 col-sm-12 col-xs12">
                {this.props.reviews.length ?
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                        {
                          titleReviews.filter((value) => value.tableShow).map((item, key) =>
                            <td key={key}>
                              <SortHeaderComponent item={item}
                                isOrdered={item.key === this.state.orderedKey}
                                getObjects={this.getReviews}
                              >
                                {item.name}
                              </SortHeaderComponent>
                            </td>)
                        }
                        </tr>
                      </thead>
                      <tbody>
                      {
                        this.props.reviews.map((item) => {
                          const fields = [];
                          let keyA = 1;
                          for (const header of titleReviews) {
                            if (header.tableShow) {
                              if (header.key === 'user' || header.key === 'pemanager') {
                                fields.push(
                                <td key={keyA}>
                                  {item[header.key].id !== undefined ? item[header.key].id.toString() : ''}
                                </td>
                              );
                              } else {
                                fields.push(
                                  <td key={keyA}>
                                    {item[header.key] !== undefined ? item[header.key].toString() : ''}
                                  </td>
                                );
                              }
                              keyA += 1;
                            }
                          }
                          fields.push(
                            <td key={keyA}>
                              <a href="#" onClick={this.editReview(item)}>
                                <i className="fa fa-edit"></i>
                              </a>
                            </td>
                          );
                          keyA += 1;
                          fields.push(
                            <td key={keyA}>
                              <ConfirmModal confirmMsg="Are you sure ?"
                                confirmAction={this.rmReview(item)}
                              >
                                <a href="#">
                                  <i className="fa fa-trash"></i>
                                </a>
                              </ConfirmModal>
                            </td>
                          );
                          return (
                            <tr key={item.id}>
                              {fields}
                            </tr>
                          );
                        })
                      }
                      </tbody>
                    </table>
                  </div> :
                  <div>
                    { this.props.isFetchingReviews ?
                      <div /> :
                      <h3>Nothing found</h3>
                    }
                  </div>
                }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReviewsAdminComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    reviews: state.admin.reviews,
    isFetchingReviews: state.admin.isFetchingReviews,
    noMoreReviews: state.admin.noMoreReviews
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(AdminActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewsAdminComponent);
