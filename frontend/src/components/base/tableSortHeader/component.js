import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';


const propTypes = {
  item: PropTypes.object.isRequired,
  getObjects: PropTypes.func.isRequired,
  isOrdered: PropTypes.bool.isRequired
};

class SortAdminComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortAction: false,
    };
    this.handleSort = this.handleSort.bind(this);
  }


  handleSort(ev) {
    ev.preventDefault();
    let direction = '';
    if (this.state.sortAction) {
      direction = '-';
    }
    this.props.getObjects(1, this.props.item.key, true, direction);
    this.setState({
      sortAction: !this.state.sortAction,
    });
  }


  render() {
    const classname = classnames({
      sort: true,
      'ion-arrow-up-a': !this.state.sortAction,
      'ion-arrow-down-a': this.state.sortAction
    });

    return (
      <div>
        <a href="#" onClick={ this.handleSort }>
          { this.props.item.name }
          { this.props.isOrdered ? <i className={classname}></i> : <i></i> }
        </a>

      </div>
    );
  }
}

SortAdminComponent.propTypes = propTypes;


export default SortAdminComponent;

