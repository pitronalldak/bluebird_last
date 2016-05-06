import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as PeManagerActions from '../../actions/peManager';
import AddReviewComponent from './addReview/component';
import ItemReviewComponent from './items/component';


const propTypes = {
  routeParams: PropTypes.object.isRequired,
  getPeManager: PropTypes.func.isRequired,
  peManager: PropTypes.object.isRequired,
  location: PropTypes.object,
  isAuth: PropTypes.bool.isRequired,
  history: PropTypes.func.isRequired
};


class PeManagerComponent extends Component {

  componentWillMount() {
    this.props.getPeManager(this.props.routeParams.peManagerId);
  }

  render() {
    const path = require('../../assets/images/users/avatar-1.jpg');
    return (
      <div className="content-page list-ui-content">
        <div className="content" >
          <div className="container">
            <div className="row">
              <div className="col-sm-2">
                <div className="mini-stat clearfix bx-shadow bg-white pe-profile-section">
                  <div className="user-details">
                    <div className="user-photo">
                      <div className="pull-left">
                        <img src={path} className="thumb-md img-circle" />
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary waves-effect waves-light m-b-5 pull-right"
                        onClick={this.props.history.goBack}
                      >
                        Back
                      </button>
                    </div>
                    <div className="user-profile">
                      <h4>{this.props.peManager.name}</h4>
                      <a href="#">{this.props.peManager.url}</a>
                    </div>
                    <fieldset className="rating">
                      { Array.apply(null, { length: this.props.peManager.rating }).map((item1, key) =>
                        (<label key={key} className="full" title="Awesome - 5 stars"></label>)
                        )
                      }
                    </fieldset>
                    <p className="review-count">#3 of 423 Reviews</p>
                    <div className="blank"></div>
                    <p className="investment-manager">If you are the investment manager,</p>
                    <a className="investment-manager-link" href="#">Click here</a>
                  </div>
                </div>
              </div>

          <ItemReviewComponent
            peManagerId={this.props.routeParams.peManagerId}
            path={this.props.location.pathname}
          />
          {this.props.isAuth &&
          <AddReviewComponent
            peManager={this.props.peManager}
          />
          }
          </div>

    </div>
    </div>
  </div>

    );
  }
}

PeManagerComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isAuth: state.profile.isAuth,
    peManager: state.peManager.peManager,
    isFetchingPeManager: state.peManager.isFetchingPeManager,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(PeManagerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PeManagerComponent);
