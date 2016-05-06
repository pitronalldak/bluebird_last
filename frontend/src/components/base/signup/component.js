import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';
import Joi from 'joi';

import classnames from 'classnames';

import config from '../../../config/config';
import * as ProfileActions from '../../../actions/profile';
import { Modal, Button } from 'react-bootstrap';
import getValidatorData from '../validatorData/component';


const propTypes = {
  apiErrors: React.PropTypes.object,
  validate: React.PropTypes.func,
  isValid: React.PropTypes.func,
  reg: React.PropTypes.func.isRequired,
  handleValidation: React.PropTypes.func,
  getValidationMessages: React.PropTypes.func,
  clearValidations: React.PropTypes.func,
  closeModal: React.PropTypes.func.isRequired,
  path: React.PropTypes.string.isRequired,
  toggleSignInModal: React.PropTypes.func.isRequired,
};


class SignUpComponent extends Component {
  constructor(props) {
    super(props);
    this.validatorTypes = {
      first_name: Joi.string().required(),
      last_name: Joi.string().allow(null),
      address: Joi.string().required(),
      username: Joi.string().email().required().label('Email'),
      password: Joi.string().required().label('pasword'),
      verifyPassword: Joi.any().valid(Joi.ref('password')).required()
    };
    this.getValidatorData = this.getValidatorData.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.getClassesName = this.getClassesName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { hideError: false };
    this.setPath = this.setPath.bind(this);
    this.openSignIn = this.openSignIn.bind(this);
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
      'has-error': !this.props.isValid(field)
    });
  }
  getClassesName(field) {
    return classnames({
      'col-sm-4': true,
      'col-sm-4 has-error': !this.props.isValid(field)
    });
  }

  getValidatorData() {
    return getValidatorData(this.refs, this.validatorTypes);
  }

  setPath() {
    window.localStorage.setItem('prevPath', this.props.path);
  }

  getValidationMessages(fieldName) {
    if (!this.state.hideError && this.props.apiErrors) {
      const apiErrors = this.props.apiErrors[fieldName];
      if (apiErrors) {
        return apiErrors[0];
      }
    }
    return this.props.getValidationMessages(fieldName);
  }

  handleSubmit(event) {
    event.preventDefault();
    const onValidate = (error) => {
      if (!error) {
        const data = this.getValidatorData();
        this.setState({ hideError: false });
        this.props.reg(data, this.props.closeModal);
      }
    };
    this.props.validate(onValidate);
  }
  openSignIn() {
    this.props.closeModal();
    this.props.toggleSignInModal();
  }

  render() {
    const path = require('../../../assets/images/logo.svg');
    return (
      <Modal {...this.props} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <div className="pull-left">
            <h5>Log in to</h5>
            <img src={path} />
          </div>
          <p className="pull-right">Already have an account?
          <a href="#" onClick={this.openSignIn}> Log in</a></p>
        </Modal.Header>
        <Modal.Body>
          <form className="form-horizontal" onSubmit={this.handleSubmit} role="form">
            <div className="form-group">
              <div className="col-xs-12">
                <a onClick={this.setPath}
                  href={`${config.baseUrl}/api/auth/linkedin/?redirect=true`}
                >
                  <button
                    type="button"
                    className="btn btn-default waves-effect
                      m-b-5 form-control text-center linked-in-btn"
                  >
                    <i className="fa fa-linkedin-square pull-left"></i>Log in with Linkedin
                  </button>
                </a>
              </div>
            </div>
            <h5>By proceeding, you agree to our <a href="#"> Terms of Service </a></h5>
            <h5>Or, log in with your email:</h5>
            <div className="form-group">
              <label className="col-sm-4 control-label">Name</label>
              <div className={this.getClassesName('first_name')}>
                <input
                  ref="first_name" name="first_name" type="text"
                  onChange={this.onChange('first_name')}
                  placeholder="First name" className="form-control"
                />
                <label className="error">
                  {this.props.getValidationMessages('first_name')}
                </label>
              </div>
              <div className={this.getClassesName('last_name')}>
                <input ref="last_name" name="last_name" type="text"
                  onChange={this.onChange('last_name')}
                  placeholder="Last Name" className="form-control"
                />
                <label className="error">
                  {this.props.getValidationMessages('last_name')}
                </label>
              </div>
            </div>
            <div className={this.getClasses('username')}>
              <label className="col-sm-4 control-label">Email</label>
              <div className="col-sm-8">
                <input ref="username" name="username" type="text"
                  onChange={this.onChange('username')}
                  placeholder="Enter your email" className="form-control"
                />
                <label className="error">
                  {this.props.getValidationMessages('username')}
                </label>
              </div>
            </div>
            <div className={this.getClasses('address')}>
              <label className="col-sm-4 control-label">
                Community,State, Country of Residence
              </label>
              <div className="col-sm-8">
                <input ref="address" name="address" type="text"
                  onChange={this.onChange('address')}
                  placeholder="Your location" className="form-control"
                />
                <label className="error">
                  {this.props.getValidationMessages('address')}
                </label>
              </div>
            </div>
            <div className={this.getClasses('password')}>
              <label className="col-sm-4 control-label">Password</label>
              <div className="col-sm-8">
                <input ref="password" name="password" type="password"
                  onChange={this.onChange('password')}
                  placeholder="Your password needs to ar least 8 characters long"
                  className="form-control"
                />
                <label className="error">
                  {this.props.getValidationMessages('password')}
                </label>
              </div>
            </div>
            <div className={this.getClasses('verifyPassword')}>
              <label className="col-sm-4 control-label">Confirm your password</label>
              <div className="col-sm-8">
                <input ref="verifyPassword" name="verifyPassword" type="password"
                  onChange={this.onChange('verifyPassword')}
                  placeholder="Confirm your password"
                  className="form-control"
                />
                <label className="error">
                  {this.props.getValidationMessages('verifyPassword')}
                </label>
              </div>
            </div>
            <div className="col-sm-8 col-sm-offset-4">
              <p className="signup-modal-p">
                You can provide more information if you are willing to to <a href="#">Click here</a>
              </p>
            </div>
            <div className="signup-modal modal-footer">
              <div className="col-sm-8">
                  <p className="signup-modal-p">
                    We're committed to protecting your privacy. By procedding, you agree to our
                  <a> Terms of Service</a></p>
              </div>
              <div className="col-sm-4">
                <Button className="btn btn-primary waves-effect waves-light" type="submit">
                  Sign up via Email
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    );
  }
}

SignUpComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    apiErrors: state.profile.errors
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ProfileActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  validation(strategy)(SignUpComponent)
);
