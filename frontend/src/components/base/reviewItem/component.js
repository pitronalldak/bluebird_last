import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PeManagerActions from '../../../actions/peManager';
import { Link } from 'react-router';
import { Modal, Button } from 'react-bootstrap';
import strategy from 'joi-validation-strategy';
import validation from 'react-validation-mixin';
import Joi from 'joi';
import classnames from 'classnames';
import getValidatorData from '../validatorData/component';
import AuthMessage from '../authMessage/component';

const propTypes = {
  review: PropTypes.object.isRequired,
  getValidationMessages: React.PropTypes.func,
  validate: React.PropTypes.func,
  isValid: React.PropTypes.func,
  addRaport: React.PropTypes.func,
  addThumb: React.PropTypes.func,
  path: React.PropTypes.string,
  isAuth: React.PropTypes.bool.isRequired,
};

class BlockReviewComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbs: this.props.review.thumbs,
      openRaportModal: false,
      hideError: false,
      disabledRaport: false,
      showAuthMessage: false
    };
    this.validatorTypes = {
      raport: Joi.string()
    };
    this.handleThumbs = this.handleThumbs.bind(this);
    this.getValidatorData = this.getValidatorData.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.handleRaport = this.handleRaport.bind(this);
    this.toggleRaportModal = this.toggleRaportModal.bind(this);
    this.incrementThumb = this.incrementThumb.bind(this);
    this.toggleAuthModal = this.toggleAuthModal.bind(this);
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

  handleThumbs() {
    if (this.props.isAuth) {
      this.props.addThumb(this.props.review.id, this.incrementThumb);
      this.setState({ disabledThumbs: true });
    } else {
      this.setState({ showAuthMessage: true });
    }
  }

  incrementThumb() {
    this.setState({ thumbs: this.state.thumbs + 1 });
  }

  toggleRaportModal(state) {
    return () => {
      this.setState({ openRaportModal: state });
    };
  }

  toggleAuthModal(state) {
    return () => {
      this.setState({ showAuthMessage: state });
    };
  }

  handleRaport(event) {
    event.preventDefault();
    const onValidate = (error) => {
      if (!error) {
        const data = this.getValidatorData();
        data.review = this.props.review.id;
        this.props.addRaport(data, this.toggleRaportModal(false));
        this.setState({ disabledRaport: true });
      }
    };
    this.props.validate(onValidate);
  }

  render() {
    return (
      <div key={this.props.review.id} className="col-sm-12">
      <Modal show={this.state.openRaportModal} onHide={this.toggleRaportModal(false)}>
        <Modal.Header closeButton>
          <div className="pull-left">
            <h5>Report message</h5>
          </div>
        </Modal.Header>
        <Modal.Body>
          <form className="form-horizontal" onSubmit={this.handleSubmit} role="form">
            <div className={this.getClasses('raport')}>
              <div className="col-sm-12">
                <textarea
                  ref="raport" name="raport"
                  onChange={this.onChange('raport')}
                  placeholder="Your raport" className="form-control"
                  rows="6"
                />
                <label className="error">
                  {this.props.getValidationMessages('raport')}
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <Button
                className="btn btn-primary waves-effect waves-light"
                type="submit"
                onClick={this.handleRaport}
              >Send raport</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <div className="panel panel-default panel-fill">
        <Link to={`/user/${this.props.review.user.id}`}>
          <div className="panel-heading">
            <span className="badge badge-inverse">
              {this.props.review.user.firstName[0]}{this.props.review.user.lastName[0]}
            </span>
            <h3 className="panel-title">
            {this.props.review.user.firstName} {this.props.review.user.lastName},
            <span> {this.props.review.user.address} </span></h3>
          </div>
        </Link>
        <div className="panel-body">
          <h4>{this.props.review.title}</h4>
          <p>
            {this.props.review.review}
          </p>
          <div className="row m-t-10">
            <div className="col-sm-12">
              <div className="pull-left">
              {(!this.state.disabledRaport) && (this.props.isAuth) ?
                <a
                  className="raport"
                  href="#"
                  onClick={this.toggleRaportModal(true)}
                >
                  <i className="fa fa-flag"></i>
                  <span style={{ marginLeft: '5px' }}>Raport</span>
                </a> : ' '
              }
              </div>
              <div className="pull-right">
                <span>Helpful?</span>
                <Button
                  className="btn btn-default waves-effect m-l-10 vote"
                  onClick={this.handleThumbs}
                  disabled={this.state.disabledThumbs}
                >
                  <i className="fa fa-thumbs-o-up"></i>
                  <span style={{ marginLeft: '5px' }}>
                  {
                    (this.state.thumbs > 0) ? this.state.thumbs : ' '
                  }
                  </span>
                  <span style={{ marginLeft: '5px' }}>
                    Thank {this.props.review.user.firstName} {this.props.review.user.lastName}
                  </span>
                </Button>
                <AuthMessage
                  show={this.state.showAuthMessage}
                  closeModal={this.toggleAuthModal(false)}
                  path={this.props.path}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

BlockReviewComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isAuth: state.profile.isAuth,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(PeManagerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  validation(strategy)(BlockReviewComponent)
);
