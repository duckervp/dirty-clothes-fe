import HelmetPro from 'src/layouts/common/helmet';

import { RegisterView } from 'src/sections/register';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <HelmetPro page="Register" />

      <RegisterView />
    </>
  );
}
