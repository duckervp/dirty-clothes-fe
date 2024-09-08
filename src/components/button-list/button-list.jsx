import PropTypes from "prop-types";

import {
  Grid,
  Button,
} from "@mui/material";

export function ButtonList({ items, itemId, setItemId }) {
  const handleClick = (nextId) => {
    if (nextId !== null) {
      // setId(nextId);
      setItemId(nextId);
    }
  }
  return (
    <Grid
      container
      spacing={1} // Controls both horizontal and vertical spacing
      justifyContent="center" // Centers the entire grid horizontally
    >
      {
        items?.map(item =>
          <Grid item key={item.id}>

            <Button
              variant={item.id === itemId ? "contained" : "outlined"}
              style={{
                border: '1px solid rgba(145, 158, 171, 0.2)',
                borderRadius: 0,
                width: 80,
                padding: '5px 8px',
              }}
              sx={{ m: 0, fontWeight: 100 }}
              color="inherit"
              onClick={() => handleClick(item.id)}>
              {item.name}
            </Button>
          </Grid>
        )
      }

    </Grid>

  );
}

ButtonList.propTypes = {
  items: PropTypes.array,
  itemId: PropTypes.any,
  setItemId: PropTypes.func,
}