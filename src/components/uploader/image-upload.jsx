import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import React, { useState, createRef, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import { showErrorMessage } from 'src/utils/notify';

import { useUploadFileMutation } from 'src/app/api/file/fileApiSlice';

import Loading from '../auth/Loading';

//------------------------------------------------------------

const ImageUploader = ({ imageUrl, setImageUrl, removable, disabled }) => {
  const { t } = useTranslation('profile', { keyPrefix: 'image.tooltip' });
  const [image, _setImage] = useState(null);
  const [rawImage, setRawImage] = useState();
  const inputFileRef = createRef(null);
  const [uploadFile] = useUploadFileMutation();
  const [canPerformSave, setCanPerformSave] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDoneUploading, setIsDoneUploading] = useState(false);

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
      setIsDoneUploading(false);
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
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', rawImage);
      const { data } = await uploadFile({ formData }).unwrap();
      const { url } = data;
      setImageUrl(url);
      setCanPerformSave(false);
      setIsDoneUploading(true);
    } catch (error) {
      showErrorMessage(error);
    }
    setIsUploading(false);
  };

  useEffect(() => { }, [rawImage, uploadFile, setImageUrl]);

  return (
    <Stack direction="row">
      {image ?
        <Box
          component="img"
          src={image}
          alt="photoURL"
          sx={{
            width: 120,
            height: 120,
            objectFit: 'cover',
            borderRadius: '5px',
          }}
          onClick={handleUploadButtonClick}
        /> :
        <Box sx={{
          width: 120,
          height: 120,
          objectFit: 'cover',
          borderRadius: '5px',
          background: "#eee"
        }}
        />
      }
      {isUploading && <Stack sx={{
        width: 120,
        height: 120,
        position: 'absolute',
        objectFit: 'cover',
        borderRadius: '5px',
        backgroundColor: "rgba(255, 255, 255, 0.5)"
      }}>
        <Loading />
      </Stack>}
      {isDoneUploading && <Stack justifyContent="center" alignItems="center" sx={{
        width: 120,
        height: 120,
        position: 'absolute',
        objectFit: 'cover',
        borderRadius: '5px',
        backgroundColor: "rgba(0, 0, 0, 0.5)"
      }}>
        <DoneIcon color='success' style={{ fontSize: "40px" }} />
      </Stack>}
      {!disabled && <Stack sx={{ ml: 1 }} spacing={1} justifyContent="center">
        <Tooltip title={t('upload')}>
          <IconButton
            sx={{ background: 'white', color: 'black', border: '1px solid black' }}
            onClick={handleUploadButtonClick}
          >
            <FileUploadIcon sx={{ cursor: 'pointer', fontSize: '13px' }} />
          </IconButton>
        </Tooltip>
        {removable && image && <Tooltip title={t('remove')}>
          <IconButton
            sx={{ background: 'white', color: 'red', border: '1px solid red' }}
            onClick={handleRemoveClick}
          >
            <CloseIcon sx={{ cursor: 'pointer', fontSize: '13px' }} />
          </IconButton>
        </Tooltip>}

        <Tooltip title={t('save')}>
          <IconButton
            sx={
              canPerformSave
                ? { background: 'white', color: 'green', border: '1px solid green' }
                : { display: 'none' }
            }
            onClick={handleSaveClick}
          >
            <CheckIcon sx={{ cursor: 'pointer', fontSize: '13px' }} />
          </IconButton>
        </Tooltip>
      </Stack>}

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
  removable: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default ImageUploader;
