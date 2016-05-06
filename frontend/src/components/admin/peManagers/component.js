import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AdminActions from '../../../actions/admin';
import Joi from 'joi';

import LoadFileComponent from './fileComponent';
import SortHeaderComponent from '../../base/tableSortHeader/component';
import PeManagerModal from './peManagerModal';
import ConfirmModal from '../../base/confirm/component';


const propTypes = {
  getPeManagers: PropTypes.func.isRequired,
  rmPeManager: PropTypes.func.isRequired,
  addPeManager: PropTypes.func.isRequired,
  peManagers: PropTypes.array.isRequired,
  isFetchingPeManager: PropTypes.bool.isRequired,
  noMorePeManager: PropTypes.bool.isRequired,
};

const titlePeManager = [
  { name: 'id',
    key: 'id',
    formShow: false,
    type: 'text'
  },
  { name: 'Verify',
    key: 'isVerify',
    formShow: true,
    type: 'select',
    choices: [
      'true', 'false'
    ]
  },
  { name: 'PE Manager name',
    key: 'name',
    formShow: true,
    validation: Joi.string().required(),
    type: 'text'
  },
  { name: 'Website',
    key: 'url',
    formShow: true,
    validation: Joi.string(),
    type: 'text'
  },
  { name: 'Investment strategy',
    key: 'investmentStrategy',
    formShow: true,
    validation: Joi.string(),
    type: 'select',
    choices: [
      'Buyout', 'Fund of Funds', 'Growth', 'Hedge Fund', 'Infrastructure', 'Secondaries', 'Venture'
    ]
  },
  { name: 'Region',
    key: 'region',
    formShow: true,
    validation: Joi.string(),
    type: 'select',
    choices: [
      'Asia pacific', 'Europe', 'Middle East & Africa', 'North America', 'South America'
    ]
  },
  { name: 'Country',
    key: 'country',
    formShow: true,
    validation: Joi.string(),
    type: 'text'
  },
  { name: 'Industry focus',
    key: 'industryFocus',
    formShow: true,
    validation: Joi.string(),
    type: 'select',
    choices: [
      'Consumer & Retail', 'Generalist', 'Healthcare', 'Tehnology & Software'
    ]
  },
    { name: 'Assets under Management (AUM)',
    key: 'aum',
    formShow: true,
    validation: Joi.string(),
    type: 'select',
    choices: [
      'true', 'false'
    ]
  },
  { name: 'Rating',
    key: 'rating',
    formShow: true,
    validation: Joi.string(),
    type: 'select',
    choices: [
      '1', '2', '3', '4', '5'
    ]
  },
  { name: 'Business Address',
    key: 'address',
    formShow: true,
    validation: Joi.string(),
    type: 'text'
  },
  { name: 'Contact Name',
    key: 'contactName',
    formShow: true,
    validation: Joi.string(),
    type: 'text'
  },
  { name: 'Contact Email',
    key: 'email',
    formShow: true,
    validation: Joi.string().email().label('Email'),
    type: 'text'
  },
  { name: 'Phone',
    key: 'phone',
    formShow: true,
    validation: Joi.string(),
    type: 'text'
  },
  { name: 'Fax',
    key: 'fax',
    formShow: true,
    validation: Joi.string(),
    type: 'text'
  },
  { name: 'Comments',
    key: 'comments',
    formShow: true,
    validation: Joi.string(),
    type: 'text'
  },
  { name: 'Create date',
    key: 'dateCreate',
    formShow: false,
    validation: Joi.string(),
    type: 'text'
  }
];

class PeManagerAdminComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModalRemove: false,
      editedPeManager: null,
      verify: undefined,
      orderedKey: 'id',
      searchTimeoutId: null,
      showPeManagerModal: false,
      currentPage: 1
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.rmPeManager = this.rmPeManager.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.getPeManagers = this.getPeManagers.bind(this);
    this.editPeManager = this.editPeManager.bind(this);
    this.handleVerify = this.handleVerify.bind(this);
  }

  componentWillMount() {
    this.getPeManagers(1, 'id', true, '-');
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
      this.getPeManagers(
        1, this.state.orderedKey, true, this.state.direction
      );
    }, 600);
    this.setState({ searchTimeoutId, search: searchValue });
  }

  getPeManagers(page, ordering, sort, direction) {
    this.props.getPeManagers(page, ordering, sort, direction, this.state.search, this.state.verify);
    this.setState({ orderedKey: ordering, currentPage: page, direction });
  }

  togglePeManagerModal(state) {
    return (ev) => {
      if (ev) {
        ev.preventDefault();
      }
      this.setState({ showPeManagerModal: state, editedPeManager: null });
    };
  }

  editPeManager(peManager) {
    return (ev) => {
      ev.preventDefault();
      this.setState({ editedPeManager: peManager, showPeManagerModal: true });
    };
  }

  handleVerify() {
    let verify = undefined;
    if (this.refs.verify.value === 'all') {
      this.setState({ verify: undefined });
    }
    if (this.refs.verify.value === 'verify') {
      this.setState({ verify: true });
      verify = true;
    }
    if (this.refs.verify.value === 'notVerify') {
      this.setState({ verify: false });
      verify = false;
    }
    this.props.getPeManagers(
      this.state.page,
      this.state.orderedKey,
      true,
      this.state.direction,
      this.state.search,
      verify
    );
  }

  handleScroll(event) {
    event.preventDefault();
    const body = document.body;
    const html = document.documentElement;
    const scrollTop = event.srcElement.body.scrollTop;
    const scrollHeight = Math.max(body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight);
    if (scrollTop + window.innerHeight > (0.9 * scrollHeight)) {
      if (!this.props.isFetchingPeManager && !this.props.noMorePeManager) {
        this.getPeManagers(this.state.currentPage + 1,
          this.state.orderedKey,
          false,
          this.state.direction,
        );
      }
    }
  }

  rmPeManager(peManager) {
    return () => {
      this.props.rmPeManager(peManager.id);
    };
  }

  render() {
    return (
      <div className="row" >
        <div className="col-md-12">
          <div className="panel panel-default">
            <div className="panel-heading">
              <div className="row">
                <div className="col-sm-2">
                  <h4 className="panel-title">PE Managers</h4>
                  <select
                    ref="verify"
                    onChange={this.handleVerify}
                    defaultValue="all"
                  >
                    <option value="all">All</option>
                    <option value="verify">Only verify</option>
                    <option value="notVerify">Not verify</option>
                  </select>
                </div>
                <div className="col-sm-2">
                  <a href="#"
                    onClick={this.togglePeManagerModal(true)}
                    className="btn btn-primary waves-effect waves-light m-b-5"
                  >
                    Add PE Manager
                  </a>
                  <PeManagerModal
                    show={this.state.showPeManagerModal}
                    peManager={this.state.editedPeManager}
                    titlePeManager={titlePeManager}
                    closeModal={this.togglePeManagerModal(false)}
                  />
                </div>
                <div className="col-sm-1">
                  <LoadFileComponent onSuccess={this.getPeManagers} />
                </div>
                <form className="form-horizontal col-sm-7">
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
                <div className="col-md-12 col-sm-12 col-xs-12">
                { this.props.peManagers.length ?
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          {
                            titlePeManager.map((item, key) =>
                              <td key={key}>
                                <SortHeaderComponent item={item}
                                  isOrdered={item.key === this.state.orderedKey}
                                  getObjects={this.getPeManagers}
                                >
                                  {item.name}
                                </SortHeaderComponent>
                              </td>)
                          }
                        </tr>
                      </thead>
                      <tbody>
                      {
                        this.props.peManagers.map((item) => {
                          const fields = [];
                          let keyA = 1;
                          for (const header of titlePeManager) {
                            fields.push(
                              <td key={keyA}>
                                {item[header.key] ? item[header.key].toString() : ''}
                              </td>
                            );
                            keyA += 1;
                          }
                          fields.push(
                            <td key={keyA}>
                              <a href="#" onClick={this.editPeManager(item)}>
                                <i className="fa fa-edit"></i>
                              </a>
                            </td>
                          );
                          keyA += 1;
                          fields.push(
                            <td key={keyA}>
                              <ConfirmModal confirmMsg="Are you sure ?"
                                confirmAction={this.rmPeManager(item)}
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
                    { this.props.isFetchingPeManager ?
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

PeManagerAdminComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    peManagers: state.admin.peManagers,
    isFetchingPeManager: state.admin.isFetchingPeManager,
    noMorePeManager: state.admin.noMorePeManager,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(AdminActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PeManagerAdminComponent);
