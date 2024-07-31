import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";

import { setUser, setCredentials } from "src/app/api/auth/authSlice";

export default function useLogin() {
  const dispatch = useDispatch();

  const handleLogin = (response) => {
    const { accessToken, refreshToken } = response.data;
    const { user } = jwtDecode(accessToken);
    dispatch(setCredentials({ accessToken, refreshToken }));
    dispatch(setUser(JSON.parse(user)));
  }

  return handleLogin;
}