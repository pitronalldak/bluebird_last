import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SidebarComponent from './sidebar/component';


const propTypes = {
  children: PropTypes.element.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isAuth: PropTypes.bool.isRequired,
  location: PropTypes.object
};


class BaseAdminComponent extends Component {
  render() {
    if (this.props.isAuth && this.props.isAdmin) {
      return (
         <div className="content-page list-ui-content">
          <div className="content" >
            <div className="container">
              <div className="row">
                <div className="col-sm-3 left-panel">
                 <SidebarComponent currentPath={this.props.location.pathname} />
                </div>
                <div className="col-sm-9 main-panel">
                  {this.props.children}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <div>Access denied...</div>;
  }
}

BaseAdminComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isAdmin: state.profile.isAdmin,
    isAuth: state.profile.isAuth
  };
}


export default connect(mapStateToProps)(BaseAdminComponent);
