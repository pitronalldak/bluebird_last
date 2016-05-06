import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import AddPeManagerComponent from '../addPeManager/component';


const propTypes = {
  isAuth: PropTypes.bool.isRequired,
};


class FiltersAddReviewComponent extends Component {
  render() {
    const path = require('../../../assets/images/pencil.png');
    return (
      <div className="col-sm-2 right-panel">
        <div className="panel panel-fill panel-primary">
          <div className="panel-body">
            <img src={path} />
            <p>Write a review or rating</p>
            <button
              type="button"
              className="btn btn-default waves-effect m-b-5"
            >
              Add a review
            </button>
          </div>
        </div>
        <div className="panel panel-fill panel-primary">
          <AddPeManagerComponent />
        </div>
      </div>
    );
  }
}

FiltersAddReviewComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isAuth: state.profile.isAuth
  };
}


export default connect(mapStateToProps)(FiltersAddReviewComponent);
