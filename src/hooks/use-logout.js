import { useDispatch } from "react-redux";

import { logout } from "src/app/api/auth/authSlice";

export default function useLogout() {
  const dispatch = useDispatch();

  const hanleLogout = () => {
    dispatch(logout());
  }

  return hanleLogout;
}