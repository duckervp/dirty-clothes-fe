import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import { ColorDetailView } from 'src/sections/color/detail/view';

// ----------------------------------------------------------------------

export default function CololDetailPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('color-m')} />

      <ColorDetailView />
    </>
  );
}
