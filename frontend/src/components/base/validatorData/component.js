import ReactDOM from 'react-dom';

function getValidatorData(refs, types) {
  const data = {};

  for (const [fieldName] of Object.entries(types)) {
    const field = ReactDOM.findDOMNode(refs[fieldName]);
    if (!field) {
      data[fieldName] = undefined;
      continue;
    }
    if (field.classList.contains('react-select')) {
      data[fieldName] = refs[fieldName].props.value;
    } else {
      data[fieldName] = getFieldValue(field);
    }
  }
  return data;
}


export function getFieldValue(field) {
  let fieldValue = field.value;

  if (field.type === 'checkbox') {
    fieldValue = field.checked;
  } else if (field.type === 'radio') {
    fieldValue = null;
    for (const radio of field.form.querySelectorAll(`input[name=${field.name}]`)) {
      if (radio.checked) {
        fieldValue = radio.value;
        break;
      }
    }
  }

  return fieldValue;
}


export default getValidatorData;
