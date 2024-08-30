import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useGetAllCategoriesQuery } from 'src/app/api/category/categoryApiSlice';

import CategorySelector from './category-select';

//------------------------------------------------------------------

const ProductDetailCategory = ({ categories, setSelectedCategories, disabled }) => {
  const [allCategories, setAllCategories] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState();

  const { data: categoryData } = useGetAllCategoriesQuery();

  useEffect(() => {
    if (categories) {
      const names = categories.map(item => item.name);
      setSelectedOptions(names);
    }
  }, [categories]);

  useEffect(() => {
    if (categoryData) {
      const names = [];
      categoryData?.data?.forEach(item => {
        names.push(item.parent.name);
        item.children.forEach(child => names.push(child.name));
      })
      setAllCategories(names);
    }
  }, [categoryData]);

  useEffect(() => {
    const categoryIds = [];
    selectedOptions?.forEach(category => {
      categoryData?.data?.forEach(item => {
        if (category === item.parent.name) {
          categoryIds.push(item.parent.id);
        } else {
          item.children.forEach(child => {
            if (category === child.name) {
              categoryIds.push(child.id)
            }
          });
        }
      })
    })
    
    setSelectedCategories(categoryIds);
  }, [selectedOptions, categoryData, setSelectedCategories])

  return (
    <Box>
      <Typography variant="subtitle2">
        <span style={{ color: 'red', display: "none" }}>*</span> Category
      </Typography>
      {allCategories &&
        <CategorySelector
          options={allCategories}
          selectedOptions={selectedOptions}
          onSelectionChange={setSelectedOptions}
          disabled={disabled}
        />}
    </Box>
  );
}

ProductDetailCategory.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object),
  setSelectedCategories: PropTypes.func,
  disabled: PropTypes.bool
}

export default ProductDetailCategory;