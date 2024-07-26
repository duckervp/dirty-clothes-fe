import HelmetPro from 'src/layouts/common/helmet';

import { BlogView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function BlogPage() {
  return (
    <>
      <HelmetPro page="Blog" />

      <BlogView />
    </>
  );
}
