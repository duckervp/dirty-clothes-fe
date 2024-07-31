import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useLogin from 'src/hooks/use-login';

import { selectCurrentUser } from 'src/app/api/auth/authSlice';
import { useRefreshMutation } from 'src/app/api/auth/authApiSlice';

import Loading from './Loading';

const PersistedLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [refresh] = useRefreshMutation();
  const user = useSelector(selectCurrentUser);
  const handleLogin = useLogin();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        const data = await refresh().unwrap();
        handleLogin(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!user) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, [handleLogin, refresh, dispatch, user]);

  return isLoading ? <Loading fullScreen /> : <Outlet />;
};

export default PersistedLogin;
