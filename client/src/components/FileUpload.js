import React, { Fragment, useState } from 'react';
import axios from 'axios';

const FileUpload = props => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});

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
        }
      });
      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName, filePath });
    } catch (err) {
      if (err.response.status === 500) {
        console.log("Something went wrong!");
      } else {
        console.log(err.response.data.message);
      }
    }
  }
  return (
    <Fragment>
      <form onSubmit={onSubmit}>
        <div className='custom-file'>
          <input type="file" name="" id="customFile" className="custom-file input" onChange={onChange} />
          <label htmlFor="customFile" className="custom-file-label">{filename}</label>
        </div>
        <input type="submit" value="Upload" className="btn btn-primary btn-block mt-4" />
      </form>
    </Fragment>
  )
};

export default FileUpload;