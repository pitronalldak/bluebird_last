import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import objectAssign from 'object-assign';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AdminActions from '../../../actions/admin';
import SimpleFormComponent from '../../base/simpleForm/component.js';


const propTypes = {
  closeModal: PropTypes.func.isRequired,
  addReview: PropTypes.func.isRequired,
  apiErrors: PropTypes.object,
  review: PropTypes.object,
  titleReviews: PropTypes.array.isRequired
};


class ReviewModalComponent extends Component {
  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
  }

  onSuccess(data) {
    const newData = objectAssign({}, data);
    if (this.props.review) {
      newData.id = this.props.review.id;
    }
    this.props.addReview(newData, this.props.closeModal);
  }

  render() {
    return (
      <Modal {...this.props} className="inmodal" onHide={this.props.closeModal}>
        <div className="panel-body">
          <SimpleFormComponent
            fields={this.props.titleReviews}
            defaultObj={this.props.review}
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

ReviewModalComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    apiErrors: state.admin.reviewsErrors
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AdminActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewModalComponent);
