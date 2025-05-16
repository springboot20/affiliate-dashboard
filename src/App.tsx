import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import { useEffect } from "react";
import { useAppSelector } from "./app/hook";
import { BankAppApiClient } from "./api/axios.config";
import { LocalStorage } from "./utils";

const App: React.FC = () => {
  const { tokens } = useAppSelector((state) => state.auth.data);

  useEffect(() => {
    const setAuthorizationHeader = () => {

      console.log(tokens)
      if (tokens) {
        BankAppApiClient.defaults.headers.common["Authorization"] = `Bearer ${tokens.accessToken}`;
      } else {
        delete BankAppApiClient.defaults.headers.common["Authorization"];
        LocalStorage.remove("token");
      }
    };

    setAuthorizationHeader();
  }, [tokens]);

  return <RouterProvider router={router} />;
};

export default App;
