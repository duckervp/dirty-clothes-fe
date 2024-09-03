import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { changeLang, selectCurrentLang } from 'src/app/api/lang/langSlice';

// ----------------------------------------------------------------------

const LANGS = [
  {
    value: 'vi',
    label: 'Vietnamese',
    icon: '/assets/icons/ic_flag_vi.svg',
  },
  {
    value: 'en',
    label: 'English',
    icon: '/assets/icons/ic_flag_en.svg',
  },
];

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'lang' });

  const [open, setOpen] = useState(null);

  const currentLang = useSelector(selectCurrentLang);

  const [lang, setLang] = useState(currentLang);

  const dispatch = useDispatch();

  const handleChangeLang = (lng) => {
    i18n.changeLanguage(lng.value);
    setLang(lng);
    dispatch(changeLang(lng));
    handleClose();
  }

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          ...(open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <img src={lang.icon} alt={lang.label} />
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 180,
          },
        }}
      >
        {LANGS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === lang.value}
            onClick={() => handleChangeLang(option)}
            sx={{ typography: 'body2', py: 1 }}
          >
            <Box component="img" alt={option.label} src={option.icon} sx={{ width: 28, mr: 2 }} />

            {t(option.value)}
          </MenuItem>
        ))}
      </Popover>
    </>
  );
}
