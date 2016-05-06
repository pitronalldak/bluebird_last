import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';

import { urls } from '../../../routes';


const propTypes = {
  currentPath: PropTypes.string.isRequired
};


class SidebarComponent extends Component {
  menuItemClassnames(url) {
    return classnames({
      'waves-effect': true,
      active: url === this.props.currentPath
    });
  }

  render() {
    return (
      <div className="sidebar-inner slimscrollleft" >
        <div id="sidebar-menu">
          <ul>
            <li>
              <Link className={this.menuItemClassnames(urls.admin.users.path)}
                to={urls.admin.users.path}
              >
                <i className="md md-view-list"></i><span> Users </span>
              </Link>
              <Link className={this.menuItemClassnames(urls.admin.peManagers.path)}
                to={urls.admin.peManagers.path}
              >
                <i className="md md-invert-colors-on"></i><span> PE Managers </span>
              </Link>
              <Link className={this.menuItemClassnames(urls.admin.reviews.path)}
                to={urls.admin.reviews.path}
              >
                <i className="md md-invert-colors-on"></i><span> Reviews </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

SidebarComponent.propTypes = propTypes;


export default SidebarComponent;
