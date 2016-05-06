import React, { Component, PropTypes } from 'react';
import Joi from 'joi';

import strategy from 'joi-validation-strategy';
import validation from 'react-validation-mixin';
import classnames from 'classnames';
import getValidatorData from '../validatorData/component';


const propTypes = {
  getValidationMessages: PropTypes.func,
  validate: PropTypes.func,
  isValid: PropTypes.func,
  onSuccess: PropTypes.func,
  defaultObj: PropTypes.object,
  apiErrors: PropTypes.object,
  fields: PropTypes.array.isRequired,
  footer: PropTypes.element,
  validatorTypes: PropTypes.func
};


class SimpleFormComponent extends Component {
  constructor(props) {
    super(props);
    if (this.props.validatorTypes) {
      this.validatorTypes = this.props.validatorTypes;
    } else {
      this.validatorTypes = {};
      for (const item of props.fields) {
        if (item.validation) {
          this.validatorTypes[item.key] = item.validation;
        } else {
          this.validatorTypes[item.key] = Joi.any();
        }
      }
    }
    this.getValidatorData = this.getValidatorData.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange(field) {
    return () => {
      this.props.validate(field);
    };
  }

  getClasses(field) {
    return classnames({
      'form-group': true,
      'form-group has-error': !this.props.isValid(field)
    });
  }

  getValidatorData() {
    let validatorTypes = this.validatorTypes;
    if (typeof this.validatorTypes === 'function') {
      validatorTypes = this.validatorTypes();
    }
    return getValidatorData(this.refs, validatorTypes);
  }

  getValidationMessages(fieldName) {
    if (this.props.apiErrors) {
      const apiErrors = this.props.apiErrors[fieldName];
      if (apiErrors) {
        return apiErrors[0];
      }
    }
    return this.props.getValidationMessages(fieldName)[0];
  }

  handleSubmit(event) {
    event.preventDefault();
    const onValidate = (error) => {
      if (!error) {
        const data = this.getValidatorData();
        this.props.onSuccess(data);
      }
    };
    this.props.validate(onValidate);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} role="form">
        <div>
        {
          this.props.fields.filter((value) => value.formShow).map((item, key) => {
            switch (item.type) {
              case 'checkbox':
                return (
                  <div key={key} className={this.getClasses(item.key)}>
                    <input type="checkbox"
                      ref={item.key}
                      onChange={this.onChange(item.key)}
                      defaultChecked={this.props.defaultObj ?
                        this.props.defaultObj[item.key] : false}
                    />
                    <label className="control-label">{item.name}</label>
                  </div>
                );
              case 'text':
                return (
                  <div key={key} className={this.getClasses(item.key)}>
                    <label className="col-sm-4 control-label">{item.name}</label>
                    <div className="col-sm-8">
                      <input className="form-control" ref={item.key} type="text"
                        placeholder={`Enter ${item.name}`}
                        onChange={this.onChange(item.key)}
                        defaultValue={this.props.defaultObj ? this.props.defaultObj[item.key] : ''}
                      />
                      <label className="error">
                        {this.getValidationMessages(item.key)}
                      </label>
                    </div>
                  </div>
                );
              case 'select':
                return (
                  <div key={key} className={this.getClasses(item.key)}>
                    <label className="col-sm-4 control-label" htmlFor={item.key}>{item.name}</label>
                      <div className="col-sm-8">
                      <select
                        className="form-control"
                        ref={item.key}
                        onChange={this.onChange(item.key)}
                        defaultValue={this.props.defaultObj ?
                          this.props.defaultObj[item.key] : 'default'}
                        style={!this.props.defaultObj ? { color: 'rgba(0, 0, 0, 0.5)' } : null}
                      >
                        <option disabled value="default">Select {item.name}</option>
                        {item.choices.map((choice, id) =>
                          <option key={id} value={choice}>{choice}</option>
                        )}
                      </select>
                      <label className="error">
                      </label>
                    </div>
                  </div>
                );
              default:
                return null;
            }
          })
        }
        {this.props.footer && this.props.footer}
        </div>
      </form>
    );
  }
}

SimpleFormComponent.propTypes = propTypes;

export default validation(strategy)(SimpleFormComponent);
