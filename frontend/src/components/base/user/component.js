import React, { Component, PropTypes } from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ProfileActions from '../../../actions/profile';
import SettingComponent from './setting/component';


const propTypes = {
  logout: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

class UserComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSettingModal: false,
    };
  }

  toggleSettingModal(state) {
    return () => {
      this.setState({ showSettingModal: state });
    };
  }

  render() {
    return (
      <div className="btn-group nav navbar-nav navbar-right pull-right">
        <Dropdown id="user-dropdown">
          <Dropdown.Toggle>
            <span className="badge badge-inverse">
              {this.props.profile.firstName[0]}{this.props.profile.lastName[0]}
            </span>
            {this.props.profile.firstName} {this.props.profile.lastName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem onClick={this.toggleSettingModal(true)}>Settings</MenuItem>
            <MenuItem>Profile</MenuItem>
            <MenuItem onClick={this.props.logout}>Logout</MenuItem>
          </Dropdown.Menu>
        </Dropdown>
        <SettingComponent
          show={(this.state.showSettingModal)}
          closeModal={this.toggleSettingModal(false)}
        />
      </div>
    );
  }
}

UserComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    profile: state.profile
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ProfileActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserComponent);
