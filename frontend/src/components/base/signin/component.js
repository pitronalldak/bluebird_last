import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import config from '../../../config/config';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import strategy from 'joi-validation-strategy';
import validation from 'react-validation-mixin';
import Joi from 'joi';
import classnames from 'classnames';
import getValidatorData from '../validatorData/component';
import * as ProfileActions from '../../../actions/profile';


const propTypes = {
  closeModal: PropTypes.func.isRequired,
  auth: React.PropTypes.func.isRequired,
  getValidationMessages: React.PropTypes.func,
  validate: React.PropTypes.func,
  isValid: React.PropTypes.func,
  error: React.PropTypes.string,
  path: React.PropTypes.string.isRequired,
  toggleSignUpModal: React.PropTypes.func.isRequired
};


class SignInComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { hideError: false };
    this.validatorTypes = {
      email: Joi.string().email().required().label('Email'),
      password: Joi.string().required()
    };

    this.getValidatorData = this.getValidatorData.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setPath = this.setPath.bind(this);
    this.openSignUp = this.openSignUp.bind(this);
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

  setPath() {
    window.localStorage.setItem('prevPath', this.props.path);
  }

  handleSubmit(event) {
    event.preventDefault();
    const onValidate = (error) => {
      if (!error) {
        const data = this.getValidatorData();
        data.username = data.email;
        this.setState({ hideError: true });
        this.props.auth(data, this.props.closeModal);
      }
    };
    this.props.validate(onValidate);
  }

  openSignUp() {
    this.props.closeModal();
    this.props.toggleSignUpModal();
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
          <p className="pull-right">Don't have an account?
          <a href="#" onClick={this.openSignUp}>Sign up</a> </p>
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
                    className="btn btn-default waves-effect m-b-5
                      form-control text-center linked-in-btn"
                  >
                    <i className="fa fa-linkedin-square pull-left"></i>Log in with Linkedin
                  </button>
                </a>
              </div>
            </div>
            <h5>Or, log in with your email:</h5>
            <div className={this.getClasses('email')}>
              <label className="col-sm-2 control-label">Email</label>
              <div className="col-sm-10">
                <input
                  ref="email" name="email"
                  onChange={this.onChange('email')}
                  placeholder="Enter your email" className="form-control"
                />
                <label className="error">
                  {this.props.getValidationMessages('email')}
                </label>
              </div>
            </div>

            <div className={this.getClasses('password')}>
              <label className="col-sm-2 control-label">Password</label>
              <div className="col-sm-10">
                <input ref="password" name="password" type="password"
                  onChange={this.onChange('password')}
                  placeholder="Enter your password" className="form-control"
                />
                <label className="error">
                  {this.props.getValidationMessages('password')}
                </label>
                <label className="error">{!this.state.hideError && this.props.error}</label>
              </div>
            </div>
            <div className="modal-footer">
              <a href="#">Forgot password?</a>
              <Button
                className="btn btn-primary waves-effect waves-light"
                type="submit"
                onClick={this.handleSubmit}
              >Log In</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    );
  }
}

SignInComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    error: state.profile.error
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ProfileActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  validation(strategy)(SignInComponent)
);
