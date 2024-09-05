import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

// ------------------------------------------------------------
export default function PageDisplay({ totalPage, page }) {
  return (
    <>
      {totalPage > 1 && (
        <Stack
          direction="row"
          alignItems="center"
          flexWrap="wrap-reverse"
          justifyContent="flex-end"
          sx={{ mt: 3, mb: 2 }}
        >
          <Pagination
            page={parseInt(page, 10)}
            count={totalPage}
            renderItem={(item) => (
              <PaginationItem
                component={Link}
                to={`${item.page === 1 ? '' : `?page=${item.page}`}`}
                {...item}
              />
            )}
            variant="outlined"
            shape="rounded"
          />
        </Stack>
      )}
    </>
  );
}

PageDisplay.propTypes = {
  totalPage: PropTypes.number,
  page: PropTypes.number
}