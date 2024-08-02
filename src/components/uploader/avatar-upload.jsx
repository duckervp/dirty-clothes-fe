import PropTypes from 'prop-types';
import React, { useState, createRef, useEffect } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import { showErrorMessage } from 'src/utils/notify';

import { useUploadFileMutation } from 'src/app/api/file/fileApiSlice';

const AvatarUpload = ({ imageUrl, setImageUrl }) => {
  const [image, _setImage] = useState(imageUrl);
  const [rawImage, setRawImage] = useState();
  const inputFileRef = createRef(null);
  const [uploadFile] = useUploadFileMutation();
  const [canPerformSave, setCanPerformSave] = useState(false);

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
      console.log(URL.createObjectURL(newImage));
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
    } catch (error) {
      showErrorMessage(error);
    }
  };

  useEffect(() => {}, [rawImage, uploadFile, setImageUrl]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Avatar
        src={image}
        alt="photoURL"
        sx={{
          borderRadius: 50,
          width: 120,
          height: 120,
          cursor: 'pointer',
        }}
      />
      <Box>
        <Tooltip title="Upload new avatar">
          <IconButton
            sx={{ position: 'absolute', top: -30, right: 20, background: 'white' }}
            onClick={handleUploadButtonClick}
          >
            <FileUploadIcon sx={{ cursor: 'pointer', fontSize: '13px' }} />
          </IconButton>
        </Tooltip>
      </Box>

      <input
        ref={inputFileRef}
        accept="image/*"
        hidden
        id="upload"
        type="file"
        onChange={handleOnChange}
      />

      <Tooltip title="Remove avatar">
        <IconButton
          sx={{ position: 'absolute', top: -15, right: -8, background: 'white' }}
          onClick={handleRemoveClick}
        >
          <CloseIcon sx={{ cursor: 'pointer', fontSize: '13px' }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Save">
        <IconButton
          sx={
            canPerformSave
              ? { position: 'absolute', top: 10, right: -28, background: 'white' }
              : { display: 'none' }
          }
          onClick={handleSaveClick}
        >
          <CheckIcon sx={{ cursor: 'pointer', fontSize: '13px' }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

AvatarUpload.propTypes = {
  imageUrl: PropTypes.string,
  setImageUrl: PropTypes.func,
};

export default AvatarUpload;
