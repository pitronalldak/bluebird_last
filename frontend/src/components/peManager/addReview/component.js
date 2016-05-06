import React, { Component, PropTypes } from 'react';
import fetch from 'isomorphic-fetch';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AddPeManagerComponent from '../../main/addPeManager/component';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import classnames from 'classnames';
import Joi from 'joi';
import strategy from 'joi-validation-strategy';
import validation from 'react-validation-mixin';
import * as PeManagerActions from '../../../actions/peManager';
import config from '../../../config/config';

import getValidatorData from '../../base/validatorData/component';

const propTypes = {
  isAuth: PropTypes.bool.isRequired,
  peManager: PropTypes.object,
  validate: React.PropTypes.func,
  isValid: React.PropTypes.func,
  getValidationMessages: React.PropTypes.func,
  addReview: React.PropTypes.func,
};


class AddReviewComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      hideError: false,
      rating: 0
    };
    this.validatorTypes = {
      title: Joi.string().required(),
      manager: Joi.number().required(),
      rating: Joi.string().required(),
      review: Joi.string().allow(null),
      personalExperience: Joi.boolean().allow(null),
      postedInfoUser: Joi.boolean().allow(null),
      certify: Joi.boolean().invalid(false),

    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleReview = this.handleReview.bind(this);
    this.handleRadio = this.handleRadio.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.handleManagerChange = this.handleManagerChange.bind(this);
  }

  onChange(field) {
    return () => {
      this.setState({ hideError: true });
      this.props.validate(field);
    };
  }

  getClasses(field) {
    return classnames({
      'form-group': true,
      'form-group has-error': !this.props.isValid(field)
    });
  }

  getValidatorData() {
    return getValidatorData(this.refs, this.validatorTypes);
  }

  getOptions(input) {
    return fetch(`${config.baseUrl}/api/pe_manager/pe-managers-live/?search=${input}`)
      .then((response) => response.json())
      .then((json) => {
        const options = json.results;
        return { options };
      });
  }

  handleReview(event) {
    event.preventDefault();
    const onValidate = (error) => {
      if (!error) {
        const data = this.getValidatorData();
        this.setState({ hideError: true });
        if (this.props.peManager) {
          data.pemanager = this.props.peManager.id;
        } else {
          data.pemanager = this.state.managerId;
        }
        data.rating = this.state.rating;
        this.props.addReview(data, this.toggleModal(false));
      }
    };
    this.props.validate(onValidate);
  }

  handleRadio(event) {
    this.setState({ rating: parseFloat(event.target.value) });
  }

  handleManagerChange(peManager) {
    if (peManager) {
      this.setState({ managerId: peManager.id });
    } else {
      this.setState({ managerId: peManager });
    }
  }

  toggleModal(state) {
    return () => {
      this.setState({ showModal: state });
    };
  }

  render() {
    const path = require('../../../assets/images/pencil.png');
    return (
      <div className="col-sm-2 right-panel">
        <div className="panel panel-fill panel-primary">
          <div className="panel-body">
            <img src={path} />
            <p>Write a review or rating</p>
            <button
              type="button"
              className="btn btn-default waves-effect m-b-5"
              onClick={this.toggleModal(true)}
            >
            {this.props.peManager ?
              <span>Give {this.props.peManager.name} a review </span> :
              <span>Add review</span>
            }
            </button>
          </div>
        </div>
        <Modal show={this.state.showModal} onHide={this.toggleModal(false)}
          className="add-review-modal"
        >
          <Modal.Header closeButton>
            <div className="pull-left">
              <h5>Add a review</h5>
            </div>
          </Modal.Header>
          <Modal.Body>
            <form className="form-horizontal give-review" onSubmit={this.handleReview} role="form">
              {!this.props.peManager ?
              <div className={this.getClasses('manager')}>
                <label className="col-md-4 control-label">Investment Manager/</label>
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-group-btn">
                      <button type="button" className="btn waves-effect waves-light btn-primary">
                        <i className="fa fa-search"></i>
                      </button>
                    </span>
                      <Select.Async
                        className="react-select"
                        name="manager"
                        ref="manager"
                        loadOptions={this.getOptions}
                        value={this.state.managerId}
                        onChange={this.handleManagerChange}
                      />
                  </div>
                </div>
              </div> :
              <input type="hidden" name="manager" ref="manager" value={this.props.peManager.id} />
              }
              <div className={this.getClasses('rating')}>
                <label className="col-md-4 control-label">Your rating</label>
                <div className="col-md-8">
                  <fieldset className="starRating">

                    <input id="star5" type="radio" name="rating" ref="rating" value="5"
                      onChange={this.handleRadio} checked={this.state.rating === 5}
                    />
                    <label className="full" htmlFor="star5" title="Awesome - 5 stars">
                    </label>

                    <input id="star4half" type="radio" name="rating" ref="rating" value="4.5"
                      onChange={this.handleRadio} checked={this.state.rating === 4.5}
                    />
                    <label className="half" htmlFor="star4half" title="Pretty good - 4.5 stars">
                    </label>

                    <input id="star4" type="radio" name="rating" ref="rating" value="4"
                      onChange={this.handleRadio} checked={this.state.rating === 4}
                    />
                    <label className="full" htmlFor="star4" title="Pretty good - 4 stars">
                    </label>

                    <input id="star3half" type="radio" name="rating" ref="rating" value="3.5"
                      onChange={this.handleRadio} checked={this.state.rating === 3.5}
                    />
                    <label className="half" htmlFor="star3half" title="Meh - 3.5 stars">
                    </label>

                    <input id="star3" type="radio" name="rating" ref="rating" value="3"
                      onChange={this.handleRadio} checked={this.state.rating === 3}
                    />
                    <label className="full" htmlFor="star3" title="Meh - 3 stars">
                    </label>

                    <input id="star2half" type="radio" name="rating" ref="rating" value="2.5"
                      onChange={this.handleRadio} checked={this.state.rating === 2.5}
                    />
                    <label className="half" htmlFor="star2half" title="Kinda bad - 2.5 stars">
                    </label>

                    <input id="star2" type="radio" name="rating" ref="rating" value="2"
                      onChange={this.handleRadio} checked={this.state.rating === 2}
                    />
                    <label className="full" htmlFor="star2" title="Kinda bad - 2">
                    </label>

                    <input id="star1half" type="radio" name="rating" ref="raring" value="1.5"
                      onChange={this.handleRadio} checked={this.state.rating === 1.5}
                    />
                    <label className="half" htmlFor="star1half" title="Meh - 1.5 stars">
                    </label>

                    <input id="star1" type="radio" name="rating" ref="rating" value="1"
                      onChange={this.handleRadio} checked={this.state.rating === 1}
                    />
                    <label className="full" htmlFor="star1" title="Sucks big time - 1 star">
                    </label>

                    <input id="starhalf" type="radio" name="rating" ref="rating" value="0.5"
                      onChange={this.handleRadio} checked={this.state.rating === 0.5}
                    />
                    <label className="half" htmlFor="starhalf" title="Sucks big time - 0.5 stars">
                    </label>

                  </fieldset>
                </div>
              </div>
              <div className="form-group">
                <div className={this.getClasses('title')}>
                  <label className="col-sm-4 control-label" htmlFor="review-title">
                    Review title
                  </label>
                  <div className="col-sm-8">
                      <input
                        id="example-input-normal"
                        name="title" ref="title"
                        className="form-control"
                        placeholder="Title of your reviwe"
                        type="text"
                      />
                  </div>
                  <label className="error">
                      {this.props.getValidationMessages('title')}
                    </label>
                </div>
              </div>
              <div className="form-group">
                <div className={this.getClasses('review')}>
                  <label className="col-md-4 control-label">Review</label>
                  <div className="col-md-8">
                      <textarea className="form-control" rows="5" ref="review"></textarea>
                  </div>
                  <label className="error">
                    {this.props.getValidationMessages('review')}
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-4 control-label">Additional questions</label>
                <div className="col-md-8">
                  <div className="checkbox">
                    <input
                      id="personalExperience"
                      type="checkbox"
                      ref="personalExperience"
                    />
                    <label htmlFor="personalExperience">
                      Have personal experience with this manager
                    </label>
                  </div>
                  <div className="checkbox">
                    <input
                      id="postedInfoUser"
                      type="checkbox"
                      ref="postedInfoUser"
                    />
                    <label htmlFor="postedInfoUser">
                      Agree to have my name, city, state and country posted along with the review
                    </label>
                  </div>
                  <br />
                  <div className={this.getClasses('certify')}>
                    <div className="checkbox">
                      <input
                        id="certify"
                        type="checkbox"
                        ref="certify"
                      />
                      <label htmlFor="certify">
                        I certify that this review is based on my own experience and is my
                        genuine opinion of this manager, and that I have not been offered any
                        incentive or payment for the writing of this rating and/or review
                      </label>
                    </div>
                  </div>
                  <label className="error">
                    {this.props.getValidationMessages('review')}
                  </label>
                </div>
              </div>
            <div className="form-group">
              <div className="col-sm-12">
                <Button
                  className="btn btn-primary waves-effect waves-light pull-right submit-btn"
                  type="submit"
                >
                  Submit Changes
                </Button>
              </div>
            </div>
            </form>
          </Modal.Body>
        </Modal>
        <div className="panel panel-fill panel-primary">
          <AddPeManagerComponent />
        </div>
      </div>
    );
  }
}

AddReviewComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isAuth: state.profile.isAuth
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PeManagerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  validation(strategy)(AddReviewComponent)
);

