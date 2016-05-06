import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Joi from 'joi';

import * as AdminActions from '../../../actions/admin';
import SortHeaderComponent from '../../base/tableSortHeader/component';
import UserModal from './userModal';
import ConfirmModal from '../../base/confirm/component';


const propTypes = {
  getUsers: PropTypes.func.isRequired,
  rmUser: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  isFetchingUsers: PropTypes.bool.isRequired,
  noMoreUsers: PropTypes.bool.isRequired
};

const titleUsers = [
  { name: 'id',
    key: 'id',
    formShow: false,
    tableShow: true,
    type: 'text'
  },
  { name: 'Email',
    key: 'email',
    formShow: true,
    tableShow: true,
    validation: Joi.string().email().required().label('Email'),
    type: 'text'
  },
  { name: 'Last name',
    key: 'lastName',
    formShow: true,
    tableShow: true,
    validation: Joi.string().allow(''),
    type: 'text'
  },
  { name: 'First name',
    key: 'firstName',
    formShow: true,
    tableShow: true,
    validation: Joi.string().allow(''),
    type: 'text'
  },
  { name: 'Address',
    key: 'address',
    formShow: true,
    tableShow: true,
    validation: Joi.string().allow(''),
    type: 'text'
  },
  { name: 'Title company',
    key: 'title',
    formShow: true,
    tableShow: true,
    validation: Joi.string().allow(''),
    type: 'text'
  },
  { name: 'Company',
    key: 'company',
    formShow: true,
    tableShow: true,
    validation: Joi.string().allow(''),
    type: 'text'
  },
  { name: 'Info',
    key: 'info',
    formShow: true,
    tableShow: true,
    validation: Joi.string().allow(''),
    type: 'text'
  },
  { name: 'Is admin',
    key: 'isAdmin',
    formShow: true,
    tableShow: true,
    type: 'checkbox'
  },
  { name: 'Password',
    key: 'password',
    formShow: true,
    tableShow: false,
    validation: Joi.string().required().label('password'),
    type: 'text'
  },
  { name: 'Verify password',
    key: 'verifyPassword',
    formShow: true,
    tableShow: false,
    validation: Joi.any().valid(Joi.ref('password')).required(),
    type: 'text'
  }

];

class UsersAdminComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderedKey: 'id',
      searchTimeoutId: null,
      editedUser: null,
      showUserModal: false,
      currentPage: 1
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.editUser = this.editUser.bind(this);
    this.rmUser = this.rmUser.bind(this);
  }

  componentWillMount() {
    this.getUsers(1, 'id', true, '-');
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  onSearch(event) {
    if (this.state.searchTimeoutId) {
      clearTimeout(this.state.searchTimeoutId);
    }
    const searchValue = event.target.value;
    const searchTimeoutId = setTimeout(() => {
      this.getUsers(
        1, this.state.orderedKey, true, this.state.direction
      );
    }, 600);
    this.setState({ searchTimeoutId, search: searchValue });
  }

  getUsers(page, ordering, sort, direction) {
    this.props.getUsers(page, ordering, sort, direction, this.state.search);
    this.setState({ orderedKey: ordering, currentPage: page, direction });
  }

  toggleUserModal(state) {
    return (ev) => {
      if (ev) {
        ev.preventDefault();
      }
      this.setState({ showUserModal: state, editedUser: null });
    };
  }

  editUser(user) {
    return (ev) => {
      ev.preventDefault();
      this.setState({ editedUser: user, showUserModal: true });
    };
  }

  rmUser(user) {
    return () => {
      this.props.rmUser(user.id);
    };
  }

  handleScroll(event) {
    const body = document.body;
    const html = document.documentElement;
    const scrollTop = event.srcElement.body.scrollTop;
    const scrollHeight = Math.max(body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight);

    if (scrollTop + window.innerHeight > (0.95 * scrollHeight)) {
      if (!this.props.isFetchingUsers && !this.props.noMoreUsers) {
        this.getUsers(this.state.currentPage + 1,
          this.state.orderedKey,
          false,
          this.state.direction
        );
      }
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="panel panel-default">
            <div className="panel-heading">
              <div className="row">
                <div className="col-sm-1">
                  <h3 className="panel-title">Users</h3>
                </div>
                <div className="col-sm-3">
                  <a href="#"
                    onClick={this.toggleUserModal(true)}
                    className="btn btn-primary waves-effect waves-light m-b-5"
                  >
                    Add user
                  </a>
                  <UserModal
                    show={this.state.showUserModal}
                    user={this.state.editedUser}
                    titleUsers={titleUsers}
                    closeModal={this.toggleUserModal(false)}
                  />
                </div>
                <form className="form-horizontal col-sm-6">
                  <div className="form-group">
                    <label className="col-sm-3 control-label">Search</label>
                    <div className="col-sm-9">
                      <input type="search" className="form-control input-sm"
                        onChange={this.onSearch}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="panel-body">
              <div className="row">
                <div className="col-md-12 col-sm-12 col-xs12">
                {this.props.users.length ?
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                        {
                          titleUsers.filter((value) => value.tableShow).map((item, key) =>
                            <td key={key}>
                              <SortHeaderComponent item={item}
                                isOrdered={item.key === this.state.orderedKey}
                                getObjects={this.getUsers}
                              >
                                {item.name}
                              </SortHeaderComponent>
                            </td>)
                        }
                        </tr>
                      </thead>
                      <tbody>
                      {
                        this.props.users.map((item) => {
                          const fields = [];
                          let keyA = 1;
                          for (const header of titleUsers) {
                            if (header.tableShow) {
                              fields.push(
                                <td key={keyA}>
                                  {item[header.key] ? item[header.key].toString() : ''}
                                </td>
                              );
                              keyA += 1;
                            }
                          }
                          fields.push(
                            <td key={keyA}>
                              <a href="#" onClick={this.editUser(item)}>
                                <i className="fa fa-edit"></i>
                              </a>
                            </td>
                          );
                          keyA += 1;
                          fields.push(
                            <td key={keyA}>
                              <ConfirmModal confirmMsg="Are you sure ?"
                                confirmAction={this.rmUser(item)}
                              >
                                <a href="#">
                                  <i className="fa fa-trash"></i>
                                </a>
                              </ConfirmModal>
                            </td>
                          );
                          return (
                            <tr key={item.id}>
                              {fields}
                            </tr>
                          );
                        })
                      }
                      </tbody>
                    </table>
                  </div> :
                  <div>
                    { this.props.isFetchingUsers ?
                      <div /> :
                      <h3>Nothing found</h3>
                    }
                  </div>
                }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UsersAdminComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    users: state.admin.users,
    isFetchingUsers: state.admin.isFetchingUsers,
    noMoreUsers: state.admin.noMoreUsers
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(AdminActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersAdminComponent);
