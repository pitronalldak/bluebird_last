
import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import objectAssign from 'object-assign';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as MainActions from '../../../actions/main';
import SimpleFormComponent from '../../base/simpleForm/component';
import Joi from 'joi';


const propTypes = {
  addPeManager: PropTypes.func.isRequired,
  apiErrors: PropTypes.object,
  peManager: PropTypes.object,
};

const titlePeManager = [
  { name: 'id',
    key: 'id',
    formShow: false,
    type: 'text'
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
  }
];

class AddPeManagerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddModal: false
    };
    this.onSuccess = this.onSuccess.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
  }

  onSuccess(data) {
    const newData = objectAssign({}, data);
    if (this.props.peManager) {
      newData.id = this.props.peManager.id;
    }
    this.props.addPeManager(newData, this.toggleAddModal(false));
  }

  toggleAddModal(state) {
    return () => {
      this.setState({ showAddModal: state });
    };
  }

  render() {
    return (
      <a href="#" onClick={this.toggleAddModal(true)} >
        <div className="panel-body">
          <p>Add a PE manager</p>
        <Modal
          show={this.state.showAddModal}
          className="inmodal"
          onHide={this.toggleAddModal(false)}
        >
          <Modal.Header closeButton>
            <div className="pull-left">
              <h5>Add an Investment Manager/Advisor</h5>
            </div>
          </Modal.Header>
          <Modal.Body>
            <SimpleFormComponent
              fields={titlePeManager}
              defaultObj={this.props.peManager}
              apiErrors={this.props.apiErrors}
              onSuccess={this.onSuccess}
              footer={
                <div className="modal-footer">
                  <Button
                    className="btn btn-primary waves-effect waves-light pull-right"
                    type="submit"
                  >
                    Add
                  </Button>
                </div>
              }
            />
          </Modal.Body>
        </Modal>
      </div>
    </a>
    );
  }
}

AddPeManagerComponent.propTypes = propTypes;


function mapStateToProps(state) {
  return {
    apiErrors: state.main.peManagerErrors
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(MainActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddPeManagerComponent);
