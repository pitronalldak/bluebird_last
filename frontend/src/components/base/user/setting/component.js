import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ProfileActions from '../../../../actions/profile';
import classnames from 'classnames';
import Joi from 'joi';
import strategy from 'joi-validation-strategy';
import validation from 'react-validation-mixin';

import getValidatorData from '../../validatorData/component';


const propTypes = {
  closeModal: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  getValidationMessages: React.PropTypes.func,
  isValid: React.PropTypes.func,
  apiErrors: React.PropTypes.object,
  validate: React.PropTypes.func,
  updateUser: PropTypes.func.isRequired,
};


class SettingComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { hideError: false };
    this.validatorTypes = {
      first_name: Joi.string().required(),
      last_name: Joi.string().allow(null),
      address: Joi.string().required(),
      company: Joi.string().required(),
      title: Joi.string().required(),
      info: Joi.string().required()
    };
    this.handleSubmitSetting = this.handleSubmitSetting.bind(this);
    this.getValidatorData = this.getValidatorData.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.getClassesName = this.getClassesName.bind(this);
  }

  getValidatorData() {
    return getValidatorData(this.refs, this.validatorTypes);
  }

  handleSubmitSetting(event) {
    event.preventDefault();
    const onValidate = (error) => {
      if (!error) {
        const data = this.getValidatorData();
        this.setState({ hideError: true });
        data.id = this.props.profile.id;
        this.props.updateUser(data, this.props.closeModal);
      }
    };
    this.props.validate(onValidate);
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


  getClassesName(field) {
    return classnames({
      'col-sm-4': true,
      'col-sm-4 has-error': !this.props.isValid(field)
    });
  }

  render() {
    return (
      <div className="btn-group nav navbar-nav navbar-right pull-right">
        <Modal {...this.props} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <div className="pull-left">
            <h5>User Settings</h5>
          </div>
        </Modal.Header>
        <Modal.Body>
          <form className="form-horizontal" onSubmit={this.handleSubmitSetting} role="form">
            <div className="form-group">
              <label className="col-sm-4 control-label">Name</label>
              <div className={this.getClassesName('first_name')}>
                <input
                  ref="first_name" name="first_name" type="text"
                  defaultValue={this.props.profile.firstName} className="form-control"
                />
                <label className="error">
                  {this.props.getValidationMessages('first_name')}
                </label>
              </div>
              <div className={this.getClassesName('last_name')}>
                <input
                  ref="last_name" name="last_name" type="text"
                  defaultValue={this.props.profile.lastName} className="form-control"
                />
                <label className="error">
                  {this.props.getValidationMessages('last_name')}
                </label>
              </div>
            </div>
            <div className={this.getClasses('address')}>
              <label className="col-sm-4 control-label">
                Community,State, Country of Residence
              </label>
              <div className="col-sm-8">
                <input ref="address" name="address" type="text"
                  placeholder="Your location" className="form-control"
                  defaultValue={this.props.profile.address}
                  onChange={this.onChange('address')}
                />
                <label className="error">
                  {this.props.getValidationMessages('address')}
                </label>
              </div>
            </div>
            <div className={this.getClasses('company')}>
              <label className="col-sm-4 control-label">Current company</label>
              <div className="col-sm-8">
                <input ref="company" name="company" type="text"
                  onChange={this.onChange('company')}
                  defaultValue={this.props.profile.company}
                  placeholder="Your company name" className="form-control"
                />
                <label className="error">
                  {this.props.getValidationMessages('company')}
                </label>
              </div>
            </div>
            <div className={this.getClasses('title')}>
              <label className="col-sm-4 control-label">
                Current title
              </label>
              <div className="col-sm-8">
                <input ref="title" name="title" type="text"
                  placeholder="Title" className="form-control"
                  defaultValue={this.props.profile.title}
                  onChange={this.onChange('title')}
                />
                <label className="error">
                  {this.props.getValidationMessages('title')}
                </label>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-4 control-label">
                Additional Info/biography
              </label>
              <div className="col-sm-8">
                <textarea ref="info" name="info" type="text"
                  placeholder="Write ypur bio here" className="form-control"
                  defaultValue={this.props.profile.info}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-12">
                <Button
                  className="btn btn-primary waves-effect waves-light pull-right"
                  type="submit"
                >
                  Submit Changes
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      </div>
    );
  }
}

SettingComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    profile: state.profile
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ProfileActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  validation(strategy)(SettingComponent)
);
