import * as React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import {
  useGetWardsMutation,
  useGetProvincesQuery,
  useGetDistrictsMutation,
} from 'src/app/api/address/addressApiSlice';

// -----------------------------------------------------------------

export default function AddressForm({ ward, setWard, address, setAddress, err, setErr }) {
  const { t } = useTranslation('product', { keyPrefix: 'address-form' });

  const [province, setProvince] = React.useState(null);

  const [districts, setDistricts] = React.useState([]);

  const [district, setDistrict] = React.useState(null);

  const [wards, setWards] = React.useState([]);

  const { data: provinces } = useGetProvincesQuery();

  const [getDistricts] = useGetDistrictsMutation();

  const [getWards] = useGetWardsMutation();

  React.useEffect(() => {
    if (address) {
      if (provinces) {
        const orgProvince = provinces.data?.filter(p => p.fullName === address.province).at(0);

        if (orgProvince) {
          setProvince(orgProvince);
        }
      }
    }
  }, [address, provinces]);

  React.useEffect(() => {
    const fetchDistricts = async () => {
      const { data } = await getDistricts({ provinceCode: province.code }).unwrap();
      setDistricts(data || []);
    };

    if (province && province.code) {
      fetchDistricts();
    }
  }, [getDistricts, province]);

  React.useEffect(() => {
    if (address.district && address.district !== '') {
      const orgDistrict = districts?.filter(p => p.fullName === address.district).at(0);
      if (orgDistrict) {
        setDistrict(orgDistrict);
      }
    }
  }, [districts, address]);

  React.useEffect(() => {
    const fetchWards = async () => {
      const { data } = await getWards({ districtCode: district.code }).unwrap();
      setWards(data || []);
    };

    if (district && district.code) {
      fetchWards();
    }
  }, [getWards, district]);

  React.useEffect(() => {
    if (address.ward && address.ward !== '') {
      const orgWard = wards?.filter(p => p.fullName === address.ward).at(0);
      if (orgWard) {
        setWard(orgWard);
      }
    }
  }, [wards, address, setWard]);

  const handleProvinceChange = (e, newValue) => {
    setProvince(newValue);
    setDistricts([]);
    setDistrict(null);
    setWards([]);
    setWard(null);

    const newAddress = { ...address };
    newAddress.province = newValue.fullName;
    setAddress(newAddress);

    if (err.province !== '') {
      const newErr = { ...err };
      newErr.province = '';
      setErr(newErr);
    }
  };

  const handleDistrictChange = (e, newValue) => {
    setDistrict(newValue);
    setWards([]);
    setWard(null);

    const newAddress = { ...address };
    newAddress.district = newValue.fullName;
    setAddress(newAddress);

    if (err.district !== '') {
      const newErr = { ...err };
      newErr.district = '';
      setErr(newErr);
    }
  };

  const handleWardChange = (e, newValue) => {
    setWard(newValue);

    const newAddress = { ...address };
    newAddress.ward = newValue.fullName;
    setAddress(newAddress);

    if (err.ward !== '') {
      const newErr = { ...err };
      newErr.ward = '';
      setErr(newErr);
    }
  };

  const handleTextfieldChange = (e) => {
    const newAddress = { ...address };
    newAddress[e.target.name] = e.target.value;
    setAddress(newAddress);
    if (err[e.target.name] !== '') {
      const newErr = { ...err };
      newErr[e.target.name] = '';
      setErr(newErr);
    }
  };

  return (
    <Box>
      <TextField
        id="name1"
        name="name1"
        variant="outlined"
        fullWidth
        sx={{ mb: 1.5, display: "none" }}
        autoComplete="off"
      />
      <TextField
        id="name"
        name="name"
        label={t('input-label.receiver-name')}
        value={address?.name}
        variant="outlined"
        fullWidth
        sx={{ mb: 1.5 }}
        autoComplete="n2m7-nothing"
        onChange={handleTextfieldChange}
        error={err?.name !== ''}
        helperText={err?.name !== '' && err?.name}
      />
      <Autocomplete
        disablePortal
        id="combo-box-province"
        options={provinces?.data || []}
        value={province || ''}
        getOptionLabel={(option) => (option?.fullName ? option.fullName : '')}
        isOptionEqualToValue={
          (option, value) =>
            !value || option.code === value.code
        }
        sx={{ mb: 1.5 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('input-label.province')}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'pr0-nothing', // disable autocomplete and autofill
            }}
            autoComplete='off'
            error={err?.province !== ''}
            helperText={err?.province !== '' && err?.province}
          />
        )}
        onChange={handleProvinceChange}
      />
      <Autocomplete
        disablePortal
        id="combo-box-district"
        options={districts || []}
        value={district || ''}
        getOptionLabel={(option) => (option?.fullName ? option.fullName : '')}
        isOptionEqualToValue={
          (option, value) =>
            !value || option.code === value.code
        }
        sx={{ mb: 1.5 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('input-label.district')}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'ds1-nothing', // disable autocomplete and autofill
            }}
            error={err?.district !== ''}
            helperText={err?.district !== '' && err?.district}
          />
        )}
        autoComplete={false}
        onChange={handleDistrictChange}
      />

      <Autocomplete
        disablePortal
        id="combo-box-ward"
        options={wards || {}}
        value={ward || ''}
        getOptionLabel={(option) => (option?.fullName ? option.fullName : '')}
        isOptionEqualToValue={
          (option, value) =>
            !value || option.code === value.code
        }
        sx={{ mb: 1.5 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('input-label.ward')}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'wr2-nothing', // disable autocomplete and autofill
            }}
            error={err?.ward !== ''}
            helperText={err?.ward !== '' && err?.ward}
          />
        )}
        onChange={handleWardChange}
      />
      <TextField
        id="address"
        name="address"
        label={t('input-label.detail-address')}
        variant="outlined"
        fullWidth
        value={address?.address}
        sx={{ mb: 1.5 }}
        autoComplete="ads4-nothing"
        onChange={handleTextfieldChange}
        error={err?.address !== ''}
        helperText={err?.address !== '' && err?.address}
      />
      <TextField
        id="phone"
        name="phone"
        label={t('input-label.phone')}
        variant="outlined"
        value={address?.phone}
        fullWidth
        sx={{ mb: 1.5 }}
        autoComplete="pn24-nothing"
        onChange={handleTextfieldChange}
        error={err?.phone !== ''}
        helperText={err?.phone !== '' && err?.phone}
      />
      <TextField
        id="zip"
        name="zip"
        label={t('input-label.postal-code')}
        variant="outlined"
        value={address?.zip}
        fullWidth
        sx={{ mb: 1.5 }}
        autoComplete="zp2d-nothing"
        onChange={handleTextfieldChange}
        error={err?.zip !== ''}
        helperText={err?.zip !== '' && err?.zip}
      />
      <TextField
        id="note"
        name="note"
        label={t('input-label.note')}
        variant="outlined"
        value={address?.note}
        fullWidth
        autoComplete="nt12-nothing"
        onChange={handleTextfieldChange}
        error={err?.note !== ''}
        helperText={err?.note !== '' && err?.note}
      />
    </Box>
  );
}

AddressForm.propTypes = {
  ward: PropTypes.object,
  setWard: PropTypes.func,
  address: PropTypes.object,
  setAddress: PropTypes.func,
  err: PropTypes.object,
  setErr: PropTypes.func,
};
