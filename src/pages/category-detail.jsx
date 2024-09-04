import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import { CategoryDetailView } from 'src/sections/category/detail/view';

// ----------------------------------------------------------------------

export default function CategoryDetailPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('category-m')} />

      <CategoryDetailView />
    </>
  );
}
