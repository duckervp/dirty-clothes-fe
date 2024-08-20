import { useState } from 'react';
import PropTypes from "prop-types"

// import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';
// import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
// import LoadingButton from '@mui/lab/LoadingButton';
// import { alpha, useTheme } from '@mui/material/styles';
// import InputAdornment from '@mui/material/InputAdornment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useRouter } from 'src/routes/hooks';

import ModalPopup from "../modal/modal";

//----------------------------------------------------------------------

const TitleBar = ({ title, screen }) => {
    const [popupOpen, setPopupOpen] = useState(false);

    const router = useRouter();

    const handleGoBack = () => {
        setPopupOpen(true);
    }

    const handleConfirmGoBack = () => {
        router.back();
        setPopupOpen(false);
    }

    const handleCancelGoBack = () => {
        setPopupOpen(false);
    }

    return (
        <>
            <ModalPopup open={popupOpen} setOpen={setPopupOpen} sx={{width: 500, top: '45%' }}>
                <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
                    LEAVE THIS SCREEN
                </Typography>
                <Typography variant="body1">
                    You have unsaved changes that will be lost if you leave this screen. Are you sure you want to leave this screen?
                </Typography>
                <Button
                    size="large"
                    variant="contained"
                    color="inherit"
                    onClick={handleCancelGoBack}
                    sx={{ mt: 3, width: "200px", mr: 3 }}
                >
                    No
                </Button>
                <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={handleConfirmGoBack}
                    sx={{ mt: 3, width: "200px" }}
                >
                    Yes
                </Button>
            </ModalPopup >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Stack direction="row" alignItems="center">
                    <IconButton onClick={handleGoBack}><ArrowBackIcon /></IconButton>
                    <Typography variant="h5" sx={{ ml: 1 }}>{title}</Typography>

                </Stack>
                <Typography variant="h5">
                    AAAAA
                </Typography>
            </Stack>
        </>
    );
}

TitleBar.propTypes = {
    title: PropTypes.string,
    screen: PropTypes.oneOf(['detail', 'create', 'edit']),
}

export default TitleBar;