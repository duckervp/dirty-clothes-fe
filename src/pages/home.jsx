import { Helmet } from 'react-helmet-async';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Dirty Clothes </title>
      </Helmet>

      <HomeView />
    </>
  );
}
