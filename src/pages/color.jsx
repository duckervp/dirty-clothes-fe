import { useTranslation } from 'react-i18next';

import HelmetPro from 'src/layouts/common/helmet';

import { ColorView } from 'src/sections/color/view';

// ----------------------------------------------------------------------

export default function ColorPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'page' });
  return (
    <>
      <HelmetPro page={t('color-m')} />

      <ColorView />
    </>
  );
}
