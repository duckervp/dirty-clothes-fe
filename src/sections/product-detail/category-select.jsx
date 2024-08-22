import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete from '@mui/material/Autocomplete';

const CategorySelector = ({ options, selectedOptions, onSelectionChange, disabled }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    setSelectedCategories(selectedOptions);
  }, [selectedOptions]);

  const [open, setOpen] = useState(false);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategories(newValue);
    setOpen(false); // Close the dropdown when a selection is made
    if (onSelectionChange) {
      onSelectionChange(newValue);
    }
  };

  const handleDelete = (categoryToDelete) => () => {
    const newCategories = selectedCategories.filter(
      (category) => category !== categoryToDelete
    );
    setSelectedCategories(newCategories);
    if (onSelectionChange) {
      onSelectionChange(newCategories);
    }
  };

  return (
    <Autocomplete
      disabled={disabled}
      multiple
      options={options || []}
      value={selectedCategories}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={handleCategoryChange}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={option}
            label={option}
            onDelete={handleDelete(option)}
            deleteIcon={<CloseIcon />}
            {...getTagProps({ index })}
            sx={{ margin: '4px' }}
          />
        ))
      }
    />
  );
};

CategorySelector.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedOptions: PropTypes.arrayOf(PropTypes.string),
  onSelectionChange: PropTypes.func,
  disabled: PropTypes.bool,
};

CategorySelector.defaultProps = {
  selectedOptions: [],
  onSelectionChange: () => { },
};


export default CategorySelector;