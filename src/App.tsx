import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';
import { useEffect, useCallback } from 'react';
import { useAppSelector } from './app/hook';
import { BankAppApiClient } from './api/axios.config';
import { LocalStorage } from './utils';
import { useAppDispatch } from './app/hook';
import { Token } from './types/auth/auth';
import { refreshAccessToken } from './features/thunks/auth.thunk';
import { jwtDecode } from 'jwt-decode';
import { ProfileProvider } from './context/ProfileContext';

const App: React.FC = () => {
  const { tokens } = useAppSelector((state) => state.auth.data);

  const dispatch = useAppDispatch();

  const refreshToken = useCallback(
    async (inComingRefreshToken: string) => {
      try {
        const response = dispatch(refreshAccessToken({ inComingRefreshToken }));

        const { data } = await response.unwrap();

        LocalStorage.set('tokens', data?.tokens);
      } catch (error: any) {
        console.log(error);
      }
    },
    [dispatch]
  );

  const authenticationExpires = useCallback((token: string) => {
    try {
      if (!token) {
        LocalStorage.set('authentified', false);
        return;
      }

      const decodedToken = jwtDecode<{ exp: number }>(token);
      const expirationTime = decodedToken?.exp;

      return !expirationTime || Date.now() >= expirationTime * 1000;
    } catch (error) {
      console.error('Error decoding token:', error);
      LocalStorage.set('authentified', false);
    }
  }, []);

  useEffect(() => {
    const tokens = LocalStorage.get('tokens') as Token;
    const isTokenExpired = authenticationExpires(tokens?.accessToken);

    if (isTokenExpired) {
      refreshToken(tokens?.refreshToken);
    }
  }, [authenticationExpires, refreshToken]);

  useEffect(() => {
    const setAuthorizationHeader = () => {
      if (tokens) {
        BankAppApiClient.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
      } else {
        delete BankAppApiClient.defaults.headers.common['Authorization'];
        LocalStorage.remove('token');
      }
    };

    setAuthorizationHeader();
  }, [tokens]);

  return (
    <ProfileProvider>
      <RouterProvider router={router} />
    </ProfileProvider>
  );
};

export default App;
