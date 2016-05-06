import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import FiltersMainComponent from './filters/component';
import ItemMainComponent from './items/component';
import AddReviewComponent from '../peManager/addReview/component';


const propTypes = {
  profile: PropTypes.object
};


class BaseMainComponent extends Component {
  render() {
    return (
      <div className="content-page list-ui-content">
        <div className="content" >
          <div className="container">
            <div className="row">
              <FiltersMainComponent />
              <ItemMainComponent />
              {this.props.profile.isAuth &&
                <AddReviewComponent />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

BaseMainComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    profile: state.profile
  };
}

export default BaseMainComponent;

export default connect(mapStateToProps)(BaseMainComponent);
