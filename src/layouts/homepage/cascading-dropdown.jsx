import * as React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PopupState, { bindMenu, bindHover } from 'material-ui-popup-state';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ChevronRight from '@mui/icons-material/ChevronRight';

import { useRouter } from 'src/routes/hooks';

import { useGetCategoryTreeQuery } from 'src/app/api/category/categoryApiSlice';

import HoverMenu from './hover-menu';
import headerNavConfig from './header-nav-config';

const CascadingContext = React.createContext({
  parentPopupState: null,
  rootPopupState: null,
});

function CascadingMenuItem({ onClick, ...props }) {
  const { rootPopupState } = React.useContext(CascadingContext);
  if (!rootPopupState) throw new Error('must be used inside a CascadingMenu');
  const handleClick = React.useCallback(
    (event) => {
      rootPopupState.close(event);
      if (onClick) onClick(event);
    },
    [rootPopupState, onClick]
  );

  return <MenuItem {...props} onClick={handleClick} />;
}

function CascadingSubmenu({ title, onClick, popupId, ...props }) {
  const { parentPopupState } = React.useContext(CascadingContext);

  const handleClick = React.useCallback(
    (event) => {
      parentPopupState.close(event);
      if (onClick) onClick(event);
    },
    [parentPopupState, onClick]
  );

  return (
    <PopupState
      popupId={popupId}
      variant="popover"
      parentPopupState={parentPopupState}
      disableAutoFocus
    >
      {(popupState) => (
        <Box>
          <MenuItem {...bindHover(popupState)} onClick={handleClick}>
            <Box style={{ flexGrow: 1 }}>{title}</Box>
            <ChevronRight sx={{ ml: 1 }} />
          </MenuItem>
          <CascadingMenu
            {...props}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            popupState={popupState}
          />
        </Box>
      )}
    </PopupState>
  );
}

function CascadingMenu({ popupState, ...props }) {
  const { rootPopupState } = React.useContext(CascadingContext);
  const context = React.useMemo(
    () => ({
      rootPopupState: rootPopupState || popupState,
      parentPopupState: popupState,
    }),
    [rootPopupState, popupState]
  );

  return (
    <CascadingContext.Provider value={context}>
      <HoverMenu {...props} {...bindMenu(popupState)} />
    </CascadingContext.Provider>
  );
}

const ShopMenu = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'header.menu' });
  const shopPath = '/shop';

  const router = useRouter();

  const location = useLocation();

  const [categories, setCategories] = React.useState();

  const { data: categoryData } = useGetCategoryTreeQuery();

  React.useEffect(() => {
    if (categoryData) {
      setCategories(categoryData.data);
    }
  }, [categoryData]);

  const handleRoute = (category) => {
    router.push(`${shopPath}/${category.value}`);
  };

  return (
    <PopupState variant="popover" popupId="demoMenu" disableAutoFocus>
      {(popupState) => (
        <Box>
          <Button
            color="inherit"
            variant={location.pathname.includes('/shop') ? 'outlined' : ''}
            {...bindHover(popupState)}
            sx={{ color: '#000', mr: 0.5 }}
            onClick={() => router.push(shopPath)}
          >
            {t('shop')}
          </Button>
          {headerNavConfig.map((item) => (
            <Button
              key={item.title}
              color="inherit"
              sx={{ color: '#000', mr: 0.5 }}
              onClick={() => router.push(item.path)}
              variant={location.pathname === item.path ? 'outlined' : ''}
            >
              {t(item.title)}
            </Button>
          ))}
          <CascadingMenu
            popupState={popupState}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            {categories?.map((item) => {
              if (item.children.length === 0) {
                return (
                  <CascadingMenuItem key={item.parent.id} onClick={() => handleRoute(item.parent)}>
                    {item.parent.name}
                  </CascadingMenuItem>
                );
              }
              return (
                <CascadingSubmenu
                  popupId={item.parent.name}
                  title={item.parent.name}
                  key={item.parent.id}
                  onClick={() => handleRoute(item.parent)}
                >
                  {item.children.map((child) => (
                    <CascadingMenuItem key={child.id} onClick={() => handleRoute(child)}>
                      {child.name}
                    </CascadingMenuItem>
                  ))}
                </CascadingSubmenu>
              );
            })}
          </CascadingMenu>
        </Box>
      )}
    </PopupState>
  );
};

CascadingMenuItem.propTypes = {
  onClick: PropTypes.func,
};

CascadingSubmenu.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
  popupId: PropTypes.any,
};

CascadingMenu.propTypes = {
  popupState: PropTypes.any,
};

ShopMenu.propTypes = {
  name: PropTypes.any,
  path: PropTypes.any,
  sx: PropTypes.any,
  selected: PropTypes.any,
};

export default ShopMenu;
