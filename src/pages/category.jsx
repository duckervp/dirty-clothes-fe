import HelmetPro from 'src/layouts/common/helmet';

import { CategoryView } from 'src/sections/category/view';

// ----------------------------------------------------------------------

export default function CategoryPage() {
  return (
    <>
      <HelmetPro page="Category" />

      <CategoryView />
    </>
  );
}
