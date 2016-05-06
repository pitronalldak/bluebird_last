import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserActions from '../../actions/user';
import ItemReviewComponent from './items/component';
import AddPeManagerComponent from '../main/addPeManager/component';


const propTypes = {
  routeParams: PropTypes.object.isRequired,
  getUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  history: PropTypes.func.isRequired
};


class UserComponent extends Component {
  componentWillMount() {
    this.props.getUser(this.props.routeParams.userId);
  }

  render() {
    return (
      <div className="content-page list-ui-content">
        <div className="content" >
          <div className="container">
            <div className="row">
              <div className="col-sm-2">
                <div className="mini-stat clearfix bx-shadow bg-white">
                  <div className="user-details">
                    <div className="user-photo">
                      <div className="pull-left">
                        <img src="" alt="" className="thumb-md img-circle" />
                      </div>
                        <button
                          type="button"
                          className="btn btn-default waves-effect waves-light m-b-5 pull-right"
                          onClick={this.props.history.goBack}
                        >
                          Back
                        </button>
                      </div>
                      <div className="user-profile">
                        <h3>{this.props.user.firstName} {this.props.user.lastName}</h3>
                        <h5>{this.props.user.address}</h5>
                        <p>{this.props.user.info}</p>
                      </div>
                    </div>
                  </div>
              </div>
              <ItemReviewComponent
                userId={this.props.routeParams.userId}
              />
              <div className="col-sm-2 right-panel">
                <div className="panel panel-fill panel-primary">
                  <AddPeManagerComponent />
                </div>
              </div>
        </div>
    </div>
    </div>
  </div>

    );
  }
}

UserComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isAuth: state.profile.isAuth,
    user: state.user.user,
    isFetchingUser: state.user.isFetchingUser,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(UserActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserComponent);
