import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
// import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Unstable_Grid2';
import FormGroup from '@mui/material/FormGroup';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useGetAllColorsQuery } from 'src/app/api/color/colorApiSlice';
import { SIZE_OPTIONS, PRICE_OPTIONS, TARGET_OPTIONS } from 'src/config';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ColorPicker } from 'src/components/color-utils';


// ----------------------------------------------------------------------

export default function ProductFilters({
  filter,
  setFilter,
  openFilter,
  onOpenFilter,
  onCloseFilter,
}) {
  const { t } = useTranslation('product', { keyPrefix: 'filter' });

  const { data: colorData } = useGetAllColorsQuery({ all: true });

  const [colorOptions, setColorOptions] = useState([]);

  const [selectedColors, setSelectedColors] = useState([]);

  useEffect(() => {
    if (colorData) {
      setColorOptions(colorData.data.content);
    }
  }, [colorData]);

  const handleTargetFilterChange = (event) => {
    const { name, checked } = event.target;
    const newSelectedTargets = [...filter.targets];
    if (checked) {
      newSelectedTargets.push(name);
      setFilter({
        ...filter,
        targets: newSelectedTargets,
      });
    } else {
      setFilter({
        ...filter,
        targets: newSelectedTargets.filter((target) => target !== name),
      });
    }
  };

  const handleSizeFilterChange = (event) => {
    const { name, checked } = event.target;
    const newSelectedSizes = [...filter.sizes];
    if (checked) {
      newSelectedSizes.push(name);
      setFilter({
        ...filter,
        sizes: newSelectedSizes,
      });
    } else {
      setFilter({
        ...filter,
        sizes: newSelectedSizes.filter((size) => size !== name),
      });
    }
  };

  const handlePriceFilterChange = (item) => {
    setFilter({
      ...filter,
      priceFrom: item.priceFrom,
      priceTo: item.priceTo,
    });
  };

  const handleColorSelect = (colors) => {
    setSelectedColors(colors);
    const selectedColorIds = [];
    colors.forEach((color) => {
      const colorId = colorOptions.filter((el) => el.value === color);
      if (colorId.length > 0) {
        selectedColorIds.push(colorId.at(0)?.id);
      }
    });
    setFilter({ ...filter, colorIds: selectedColorIds });
  };

  const handleClearAll = () => {
    setFilter({
      name: '',
      priceFrom: null,
      priceTo: null,
      targets: [],
      categoryIds: [],
      colorIds: [],
      sizes: [],
    });
    setSelectedColors([]);
  };

  const renderTarget = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{t('targets')}</Typography>
      <FormGroup>
        <Grid container>
          {TARGET_OPTIONS.map((item) => (
            <Grid key={item.value} xs={12} sm={6} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name={item.value}
                    checked={filter.targets.includes(item.value)}
                    onChange={handleTargetFilterChange}
                  />
                }
                label={
                  <Typography variant="subtitle2" fontWeight={300}>
                    {item.label}
                  </Typography>
                }
              />
            </Grid>
          ))}
        </Grid>
      </FormGroup>
    </Stack>
  );

  const renderSize = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Sizes</Typography>
      <FormGroup>
        <Grid container>
          {SIZE_OPTIONS.map((item) => (
            <Grid key={item.value} xs={12} sm={6} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name={item.value}
                    checked={filter.sizes.includes(item.value)}
                    onChange={handleSizeFilterChange}
                  />
                }
                label={
                  <Typography variant="subtitle2" fontWeight={300}>
                    {item.label}
                  </Typography>
                }
              />
            </Grid>
          ))}
        </Grid>
      </FormGroup>
    </Stack>
  );

  // const renderCategory = (
  //   <Stack spacing={1}>
  //     <Typography variant="subtitle2">Category</Typography>
  //     <RadioGroup>
  //       {CATEGORY_OPTIONS.map((item) => (
  //         <FormControlLabel
  //           key={item}
  //           value={item}
  //           control={<Radio />}
  //           label={
  //             <Typography variant="subtitle2" fontWeight={300}>
  //               {item}
  //             </Typography>
  //           }
  //         />
  //       ))}
  //     </RadioGroup>
  //   </Stack>
  // );

  const renderColors = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Colors</Typography>
      <ColorPicker
        name="colors"
        selected={selectedColors}
        colors={colorOptions.map((item) => item.value)}
        onSelectColor={(colors) => handleColorSelect(colors)}
        sx={{ maxWidth: 38 * 6 }}
      />
    </Stack>
  );

  const renderPrice = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Price</Typography>
      <RadioGroup>
        {PRICE_OPTIONS.map((item) => (
          <FormControlLabel
            key={item.value}
            value={item.value}
            control={
              <Radio
                checked={
                  item.priceFrom === filter.priceFrom ||
                  (!filter.priceFrom === null && !item.priceFrom === null)
                }
                onChange={() => handlePriceFilterChange(item)}
              />
            }
            label={
              <Typography variant="subtitle2" fontWeight={300}>
                {item.label}
              </Typography>
            }
          />
        ))}
      </RadioGroup>
    </Stack>
  );

  // const renderRating = (
  //   <Stack spacing={1}>
  //     <Typography variant="subtitle2">Rating</Typography>
  //     <RadioGroup>
  //       {RATING_OPTIONS.map((item, index) => (
  //         <FormControlLabel
  //           key={item}
  //           value={item}
  //           control={
  //             <Radio
  //               disableRipple
  //               color="default"
  //               icon={<Rating readOnly value={4 - index} />}
  //               checkedIcon={<Rating readOnly value={4 - index} />}
  //               sx={{
  //                 '&:hover': { bgcolor: 'transparent' },
  //               }}
  //             />
  //           }
  //           label="& Up"
  //           sx={{
  //             my: 0.5,
  //             borderRadius: 1,
  //             '&:hover': { opacity: 0.48 },
  //           }}
  //         />
  //       ))}
  //     </RadioGroup>
  //   </Stack>
  // );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={<Iconify icon="ic:round-filter-list" />}
        onClick={onOpenFilter}
      >
        {t('text')}&nbsp;
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="h6" sx={{ ml: 1 }}>
            {t('text')}
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            {renderTarget}

            {renderSize}

            {renderPrice}

            {renderColors}

            {/* {renderCategory} */}

            {/* {renderRating} */}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
            onClick={handleClearAll}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

ProductFilters.propTypes = {
  filter: PropTypes.object,
  setFilter: PropTypes.func,
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
};
