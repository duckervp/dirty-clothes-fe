import HelmetPro from 'src/layouts/common/helmet';

import { LoginView } from 'src/sections/login';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <HelmetPro page="Login" />

      <LoginView />
    </>
  );
}
