import React, { Fragment, useState } from 'react';
import axios from 'axios';

import Message from './Message';
import Progress from './Progress';

const FileUpload = props => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  }

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(parseInt(Math.round(progressEvent.loaded * 100) / progressEvent.total))
          setTimeout(() => setUploadPercentage(0), 10000);
        }
      });
      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName, filePath });

      setMessage('File uploaded');
    } catch (err) {
      if (err.response.status === 500) {
        setMessage("Something went wrong!");
      } else {
        setMessage(err.response.data.message);
      }
    }
  }
  return (
    <Fragment>
      {message && message != null ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className='custom-file'>
          <input type="file" name="" id="customFile" className="custom-file input" onChange={onChange} />
          <label htmlFor="customFile" className="custom-file-label">{filename}</label>
        </div>
        <Progress percentage={uploadPercentage} />
        <input type="submit" value="Upload" className="btn btn-primary btn-block mt-4" />
      </form>
      {uploadedFile ?
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <h3 className="text-center">
              {uploadedFile.fileName}
            </h3>
            <img src={uploadedFile.filePath} style={{ width: '100%' }} alt="" />
          </div>
        </div> : null}
    </Fragment>
  )
};

export default FileUpload;