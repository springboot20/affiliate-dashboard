import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import { useEffect } from "react";
import { useAppSelector } from "./app/hook";
import { BankAppApiClient } from "./api/axios.config";
import { LocalStorage } from "./utils";
import { useAppDispatch } from "./app/hook";
import { ProfileProvider } from "./context/ProfileContext";
import { authenticationExpires } from "@/features/auth/auth.slice";

const App: React.FC = () => {
  const { tokens } = useAppSelector((state) => state.auth.data);

  const dispatch = useAppDispatch();

  // const refreshToken = useCallback(
  //   async (inComingRefreshToken: string) => {
  //     try {
  //       const response = dispatch(refreshAccessToken({ inComingRefreshToken }));

  //       const { data } = await response.unwrap();
  //       dis

  //       LocalStorage.set('tokens', data?.tokens);
  //     } catch (error: any) {
  //       console.log(error);
  //     }
  //   },
  //   [dispatch]
  // );

  useEffect(() => {
    const tokens = LocalStorage.get("tokens");

    if (tokens) {
      dispatch(authenticationExpires(tokens.accessToken));
    }
  }, [dispatch, tokens]);

  useEffect(() => {
    const setAuthorizationHeader = () => {
      if (tokens) {
        BankAppApiClient.defaults.headers.common["Authorization"] = `Bearer ${tokens.accessToken}`;
      } else {
        delete BankAppApiClient.defaults.headers.common["Authorization"];
        LocalStorage.remove("token");
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
