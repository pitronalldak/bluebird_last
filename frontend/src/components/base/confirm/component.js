import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';


const propTypes = {
  confirmMsg: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.element,
  confirmAction: PropTypes.func
};


class ConfirmComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.confirmAction = this.confirmAction.bind(this);
  }

  showModal() {
    this.setState({ showModal: true });
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  confirmAction() {
    this.closeModal();
    setTimeout(() => {
      this.props.confirmAction();
    }, 300);
  }

  render() {
    const child = React.Children.only(this.props.children);
    const childElement = React.cloneElement(child, {
      onClick: this.showModal
    });

    const title = this.props.title || '';
    const confirmMsg = this.props.confirmMsg || 'Are you sure?';

    return (
      <span>
        {childElement}
        <Modal title={title} show={this.state.showModal} onHide={this.closeModal}>
          <div className="modal-body">
            <p>{confirmMsg}</p>
          </div>
          <div className="modal-footer">
            <Button onClick={this.closeModal}>Close</Button>
            <a onClick={this.confirmAction} className="btn btn-danger btn-ok">Confirm</a>
          </div>
        </Modal>
      </span>
    );
  }
}

ConfirmComponent.propTypes = propTypes;

export default ConfirmComponent;
