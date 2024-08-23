import PropTypes from 'prop-types';
import React, { useState, createRef, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import { showErrorMessage } from 'src/utils/notify';

import { useUploadFileMutation } from 'src/app/api/file/fileApiSlice';

const ImageUploader = ({ imageUrl, setImageUrl }) => {
  const [image, _setImage] = useState(null);
  const [rawImage, setRawImage] = useState();
  const inputFileRef = createRef(null);
  const [uploadFile] = useUploadFileMutation();
  const [canPerformSave, setCanPerformSave] = useState(false);

  useEffect(() => {
    _setImage(imageUrl);
  }, [imageUrl])

  const cleanup = () => {
    URL.revokeObjectURL(image);
    inputFileRef.current.value = null;
  };

  const setImage = (newImage) => {
    if (image) {
      cleanup();
    }
    _setImage(newImage);
  };

  const handleUploadButtonClick = () => {
    inputFileRef.current.click();
  };

  const handleOnChange = (event) => {
    const newImage = event.target?.files?.[0];

    if (newImage) {
      setRawImage(newImage);
      setImage(URL.createObjectURL(newImage));
      setCanPerformSave(true);
    }
  };

  const handleRemoveClick = (event) => {
    if (image) {
      event.preventDefault();
      setImage(null);
      setCanPerformSave(true);
    }
  };

  const handleSaveClick = async () => {
    try {
      const formData = new FormData();
      formData.append('file', rawImage);
      const { data } = await uploadFile({ formData }).unwrap();
      const { url } = data;
      setImageUrl(url);
      setCanPerformSave(false);
    } catch (error) {
      showErrorMessage(error);
    }
  };

  useEffect(() => { }, [rawImage, uploadFile, setImageUrl]);

  return (
    <Stack direction="row">
      {console.log(image)}
      {image ?
        <Box
          component="img"
          src={image}
          alt="photoURL"
          sx={{
            width: 120,
            height: 120,
            cursor: 'pointer',
            objectFit: 'cover',
            borderRadius: '5px',
          }}
          onClick={handleUploadButtonClick}
        /> :
        <Box sx={{
          width: 120,
          height: 120,
          cursor: 'pointer',
          objectFit: 'cover',
          borderRadius: '5px',
          background: "#eee"
        }}
        />
      }
      <Stack sx={{ml: 1}}>
        <Tooltip title="Upload new avatar">
          <IconButton
            sx={{ background: 'white' }}
            onClick={handleUploadButtonClick}
          >
            <FileUploadIcon sx={{ cursor: 'pointer', fontSize: '13px' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remove avatar">
          <IconButton
            sx={{ background: 'white' }}
            onClick={handleRemoveClick}
          >
            <CloseIcon sx={{ cursor: 'pointer', fontSize: '13px' }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Save">
          <IconButton
            sx={
              canPerformSave
                ? { background: 'white' }
                : { display: 'none' }
            }
            onClick={handleSaveClick}
          >
            <CheckIcon sx={{ cursor: 'pointer', fontSize: '13px' }} />
          </IconButton>
        </Tooltip>
      </Stack>

      <input
        ref={inputFileRef}
        accept="image/*"
        hidden
        id="upload"
        type="file"
        onChange={handleOnChange}
      />
    </Stack>
  );
};

ImageUploader.propTypes = {
  imageUrl: PropTypes.string,
  setImageUrl: PropTypes.func,
};

export default ImageUploader;
