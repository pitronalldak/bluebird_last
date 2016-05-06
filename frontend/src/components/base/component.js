import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';

import * as ProfileActions from '../../actions/profile';
import SignInModal from './signin/component';
import SignUpModal from './signup/component';
import UserComponent from './user/component';

const propTypes = {
  children: PropTypes.element.isRequired,
  fetchProfile: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  profile: PropTypes.object,
  location: PropTypes.object
};

const childContextTypes = {
  location: PropTypes.object
};


class BaseComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSignInModal: false,
      showSignUpModal: false,
      query: props.location.query
    };
  }

  getChildContext() {
    return { location: this.props.location };
  }

  componentWillMount() {
    this.props.fetchProfile();
  }

  componentDidMount() {
    if (this.state.query.jwtToken) {
      window.localStorage.setItem('jwt', this.state.query.jwtToken);
      browserHistory.push({ ...this.props.location, query: '' });
      this.props.fetchProfile();
      const prevPath = window.localStorage.getItem('prevPath');
      if (prevPath) {
        browserHistory.push(prevPath);
        window.localStorage.removeItem('prevPath');
      }
    }
  }

  toggleSignInModal(state) {
    return () => {
      this.setState({ showSignInModal: state });
    };
  }

  toggleSignUpModal(state) {
    return () => {
      this.setState({ showSignUpModal: state });
    };
  }

  render() {
    const path = require('../../assets/images/logo.svg');
    if (this.props.profile.isFetched) {
      return (
      <div className="fixed-left">
        <div id="wrapper">
            <div className="topbar">
              <div className="topbar-left">
                  <Link to={'/'} className="logo"><img src={path} /> </Link>
                  <p>Private Equity. Unpacked.</p>
              </div>
                <div className="navbar navbar-default" role="navigation">
                  <div className="container">
                    {!this.props.profile.isAuth ?
                      <div className="btn-group nav navbar-nav navbar-right pull-right">
                          <button
                            type="button"
                            className="btn btn-default waves-effect sign-up"
                            onClick={this.toggleSignUpModal(true)}
                          >Sign Up</button>
                          <button
                            type="button"
                            className="btn btn-default waves-effect log-in"
                            onClick={this.toggleSignInModal(true)}
                          >Log in</button>
                      </div> : <UserComponent />
                    }
                    <SignInModal
                      show={(!this.props.profile.isAuth && this.state.showSignInModal)}
                      closeModal={this.toggleSignInModal(false)}
                      path={this.props.location.pathname}
                      toggleSignUpModal = {this.toggleSignUpModal(true)}
                    />
                    <SignUpModal
                      show={(this.state.showSignUpModal)}
                      closeModal={this.toggleSignUpModal(false)}
                      path={this.props.location.pathname}
                      toggleSignInModal = {this.toggleSignInModal(true)}
                    />
                  </div>
                </div>
              </div>
              {
                this.props.children
              }
              <footer className="footer">
                  <img src={path} />
                  <p>Ratings and reviews for the Investment Community </p>
                  <a className="pull-left" href="#">About</a>
                  <a className="pull-left" href="#">Terms of Service</a>
                  <a className="pull-left" href="#">For Investment Managers/Advisors</a>
                  <p>copy PartnerVine GmbH All right reserved</p>
              </footer>
            </div>
          </div>
      );
    }
    return <div>Loading...</div>;
  }
}


BaseComponent.propTypes = propTypes;
BaseComponent.childContextTypes = childContextTypes;

function mapStateToProps(state) {
  return {
    profile: state.profile
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ProfileActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BaseComponent);
