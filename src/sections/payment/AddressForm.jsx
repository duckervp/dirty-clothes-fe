import * as React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import {
  useGetWardsMutation,
  useGetProvincesQuery,
  useGetDistrictsMutation,
} from 'src/app/api/payment/ghnApiSlice';

export default function AddressForm({ ward, setWard, address, setAddress }) {
  const [province, setProvince] = React.useState(null);

  const [districts, setDistricts] = React.useState([]);

  const [district, setDistrict] = React.useState(null);

  const [wards, setWards] = React.useState([]);

  const { data: provinces } = useGetProvincesQuery();

  const [getDistricts] = useGetDistrictsMutation();

  const [getWards] = useGetWardsMutation();

  React.useEffect(() => {
    const fetchDistricts = async () => {
      const { data } = await getDistricts({ province_id: province.ProvinceID }).unwrap();
      setDistricts(data || []);
    };

    if (province && province.ProvinceID) {
      fetchDistricts();
    }
  }, [getDistricts, province]);

  React.useEffect(() => {
    const fetchWards = async () => {
      const { data } = await getWards({ district_id: district.DistrictID }).unwrap();
      setWards(data || []);
    };

    if (district && district.DistrictID) {
      fetchWards();
    }
  }, [getWards, district]);

  const handleProvinceChange = (e, newValue) => {
    setProvince(newValue);
    setDistrict([]);
    setDistrict(null);
    setWards([]);
    setWard(null);
    
    const newAddress = { ...address };
    newAddress.province = newValue.ProvinceName;
    setAddress(newAddress);
  };

  const handleDistrictChange = (e, newValue) => {
    setDistrict(newValue);
    setWards([]);
    setWard(null);

    const newAddress = { ...address };
    newAddress.district = newValue.DistrictName;
    setAddress(newAddress);
  };

  const handleWardChange = (e, newValue) => {
    setWard(newValue);

    const newAddress = { ...address };
    newAddress.ward = newValue.WardName;
    setAddress(newAddress);
  };

  const handleTextfieldChange = (e) => {
    const newAddress = { ...address };
    newAddress[e.target.name] = e.target.value;
    setAddress(newAddress);
  };

  return (
    <Box>
      {/* <TextField
        id="email"
        name="email"
        label="Email"
        variant="outlined"
        fullWidth
        sx={{ mb: 1.5 }}
        autoComplete="nothing"
        onChange={handleTextfieldChange}
      /> */}
      <TextField
        id="name"
        name="name"
        label="Receiver Name"
        variant="outlined"
        fullWidth
        sx={{ mb: 1.5 }}
        autoComplete="nothing"
        onChange={handleTextfieldChange}
      />
      <Autocomplete
        disablePortal
        id="combo-box-district"
        options={provinces?.data || []}
        value={province}
        getOptionLabel={(option) => (option?.ProvinceName ? option.ProvinceName : '')}
        sx={{ mb: 1.5 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Province"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'nothing', // disable autocomplete and autofill
            }}
          />
        )}
        onChange={handleProvinceChange}
      />
      <Autocomplete
        disablePortal
        id="combo-box-province"
        options={districts}
        value={district}
        getOptionLabel={(option) => (option?.DistrictName ? option.DistrictName : '')}
        sx={{ mb: 1.5 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="District"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'nothing', // disable autocomplete and autofill
            }}
          />
        )}
        autoComplete={false}
        onChange={handleDistrictChange}
      />

      <Autocomplete
        disablePortal
        id="combo-box-district"
        options={wards}
        value={ward}
        getOptionLabel={(option) => (option?.WardName ? option.WardName : '')}
        sx={{ mb: 1.5 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Ward"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'nothing', // disable autocomplete and autofill
            }}
          />
        )}
        onChange={handleWardChange}
      />
      <TextField
        id="address"
        name="address"
        label="Detail Address"
        variant="outlined"
        fullWidth
        sx={{ mb: 1.5 }}
        autoComplete="nothing"
        onChange={handleTextfieldChange}
      />
      <TextField
        id="phone"
        name="phone"
        label="Phone"
        variant="outlined"
        fullWidth
        sx={{ mb: 1.5 }}
        autoComplete="nothing"
        onChange={handleTextfieldChange}
      />
      <TextField
        id="zip"
        name="zip"
        label="Postal/Zip Code"
        variant="outlined"
        fullWidth
        sx={{ mb: 1.5 }}
        autoComplete="nothing"
        onChange={handleTextfieldChange}
      />
      <TextField
        id="note"
        name="note"
        label="Note"
        variant="outlined"
        fullWidth
        autoComplete="nothing"
        onChange={handleTextfieldChange}
      />
    </Box>
  );
}

AddressForm.propTypes = {
  ward: PropTypes.object,
  setWard: PropTypes.func,
  address: PropTypes.object,
  setAddress: PropTypes.func,
};
