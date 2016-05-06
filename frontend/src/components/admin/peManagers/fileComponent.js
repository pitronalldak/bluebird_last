import React, { Component, PropTypes } from 'react';
import { Modal } from 'react-bootstrap';
import config from '../../../config/config';


const propTypes = {
  onSuccess: PropTypes.func.isRequired
};


class FileLoadComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      percentComplete: 0,
      inProgress: false
    };
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.addFile = this.addFile.bind(this);
  }

  showModal(ev) {
    ev.preventDefault();
    this.setState({
      showModal: true
    });
  }

  closeModal() {
    this.setState({
      showModal: false
    });
  }

  addFile() {
    this.setState({ inProgress: true });
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${config.baseUrl}/api/admin/pe-managers/add-file/`);
    xhr.setRequestHeader('Authorization', `JWT ${window.localStorage.jwt}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        this.setState({ percentComplete });
      }
    };

    xhr.onloadend = () => {
      this.setState({ inProgress: false, showModal: false });
      this.props.onSuccess(1, 'id', true, '-');
    };

    const data = new FormData();
    data.append('file', this.refs.file.files[0]);
    xhr.send(data);
  }

  render() {
    const clsPrgrs = 'progress-bar progress-bar-primary wow animated progress-animated animated';
    return (
      <div>
        <Modal {...this.props} className="inmodal"
          show={this.state.showModal} onHide={this.closeModal}
        >
          <div className="panel-body">
            <form className="uploader"
              encType="multipart/form-data"
              method="post"
              onSubmit={this.addFile}
            >
              <input type="file" ref="file" onChange={this.addFile} className="upload" />
            </form>
            {this.state.inProgress &&
            <div className="progress">
              <div
                className={clsPrgrs}
                role="progressbar" ariaValuenow="60" ariaValuemin="0"
                ariaValuemax="100"
                style={
                  { width: `${this.state.percentComplete}%`,
                    visibility: 'visible',
                    animationName: 'animationProgress'
                  }
                }
              >
              </div>
            </div>
            }
            {(this.state.inProgress && this.state.percentComplete === 100) &&
              <span>Parcing file...</span>
            }
          </div>
        </Modal>
        <a href="#"
          className="btn btn-primary waves-effect waves-light m-b-5"
          onClick={this.showModal}
        >
          Upload</a>
     </div>
    );
  }
}

FileLoadComponent.propTypes = propTypes;

export default FileLoadComponent;
