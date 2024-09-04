import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import { CategoryView } from 'src/sections/category/view';

// ----------------------------------------------------------------------

export default function CategoryPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('category-m')} />

      <CategoryView />
    </>
  );
}
