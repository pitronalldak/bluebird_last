import React, { Component, PropTypes } from 'react';
import { Modal } from 'react-bootstrap';

import SignInModal from '../signin/component';
import SignUpModal from '../signup/component';

const propTypes = {
  closeModal: PropTypes.func.isRequired,
};

class AuthMessageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      showSignInModal: false,
      showSignUpModal: false,

    };
  }

  toggleSignUpModal(state) {
    return () => {
      this.setState({ showSignUpModal: state });
    };
  }

  toggleSignInModal(state) {
    return () => {
      this.setState({ showSignInModal: state });
    };
  }

  render() {
    return (
      <Modal {...this.props} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <div className="pull-left">
            <h5>Auth message</h5>
          </div>
        </Modal.Header>
        <Modal.Body>
                <p>
                You should <a href="" onClick={this.toggleSignInModal(true)}>
                logIn
                </a> or <a href="" onClick={this.toggleSignUpModal(true)}>
                signUp
                </a>
                </p>
            <SignInModal
              show={(this.state.showSignInModal)}
              closeModal={this.toggleSignInModal(false)}
              path={this.props.path}
              toggleSignUpModal = {this.toggleSignUpModal(true)}
            />
            <SignUpModal
              show={(this.state.showSignUpModal)}
              closeModal={this.toggleSignUpModal(false)}
              path={this.props.path}
              toggleSignInModal = {this.toggleSignInModal(true)}
            />
        </Modal.Body>
      </Modal>
    );
  }
}

AuthMessageComponent.propTypes = propTypes;

export default AuthMessageComponent;
