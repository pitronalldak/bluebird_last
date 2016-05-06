import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import objectAssign from 'object-assign';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AdminActions from '../../../actions/admin';
import SimpleFormComponent from '../../base/simpleForm/component';


const propTypes = {
  closeModal: PropTypes.func.isRequired,
  addPeManager: PropTypes.func.isRequired,
  apiErrors: PropTypes.object,
  peManager: PropTypes.object,
  titlePeManager: PropTypes.array.isRequired
};


class PeManagerModalComponent extends Component {
  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
  }

  onSuccess(data) {
    const newData = objectAssign({}, data);
    if (this.props.peManager) {
      newData.id = this.props.peManager.id;
    }
    this.props.addPeManager(newData, this.props.closeModal);
  }

  render() {
    return (
      <Modal {...this.props} className="inmodal" onHide={this.props.closeModal}>
        <div className="panel-body">
          <SimpleFormComponent
            fields={this.props.titlePeManager}
            defaultObj={this.props.peManager}
            apiErrors={this.props.apiErrors}
            onSuccess={this.onSuccess}
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

PeManagerModalComponent.propTypes = propTypes;


function mapStateToProps(state) {
  return {
    apiErrors: state.admin.peManagerErrors
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(AdminActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PeManagerModalComponent);
