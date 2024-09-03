import HelmetPro from 'src/layouts/common/helmet';

import { CategoryDetailView } from 'src/sections/category/detail/view';

// ----------------------------------------------------------------------

export default function CategoryDetailPage() {
  return (
    <>
      <HelmetPro page="Category" />

      <CategoryDetailView />
    </>
  );
}
