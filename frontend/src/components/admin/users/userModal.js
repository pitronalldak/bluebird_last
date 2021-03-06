import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import objectAssign from 'object-assign';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Joi from 'joi';
import * as AdminActions from '../../../actions/admin';
import SimpleFormComponent from '../../base/simpleForm/component.js';


const propTypes = {
  closeModal: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
  getValidationMessages: PropTypes.func,
  validate: PropTypes.func,
  isValid: PropTypes.func,
  apiErrors: PropTypes.object,
  user: PropTypes.object,
  titleUsers: PropTypes.array.isRequired
};


class UserModalComponent extends Component {
  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
    this.validatorTypes = this.validatorTypes.bind(this);
  }

  onSuccess(data) {
    const newData = objectAssign({}, data);
    if (this.props.user) {
      newData.id = this.props.user.id;
    }
    this.props.addUser(newData, this.props.closeModal);
  }

  validatorTypes() {
    const base = {};
    for (const item of this.props.titleUsers) {
      if (item.validation) {
        base[item.key] = item.validation;
      }
    }
    if (this.props.user) {
      base.password = Joi.string().allow('').label('password');
      base.verifyPassword = Joi.string().allow('');
    }
    base.isAdmin = Joi.boolean();
    return base;
  }

  render() {
    return (
      <Modal {...this.props} className="inmodal" onHide={this.props.closeModal}>
        <div className="panel-body">
          <SimpleFormComponent
            fields={this.props.titleUsers}
            defaultObj={this.props.user}
            apiErrors={this.props.apiErrors}
            onSuccess={this.onSuccess}
            validatorTypes={this.validatorTypes}
            footer={
              <div className="modal-footer">
                <Button bsStyle="primary" type="submit">Save</Button>
                <Button onClick={this.props.closeModal}>Close</Button>
              </div>
            }
          />
        </div>
      </Modal>
    );
  }
}

UserModalComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    apiErrors: state.admin.usersErrors
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AdminActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserModalComponent);
