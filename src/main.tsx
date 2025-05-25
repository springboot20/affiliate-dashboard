import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "@material-tailwind/react";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { SkeletonTheme } from "react-loading-skeleton";
import store from "./app/store";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.min.css";
import { SocketProvider } from "./context/SocketContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <SocketProvider>
          <SkeletonTheme enableAnimation highlightColor="#9199AF">
            <ToastContainer />
            <App />
          </SkeletonTheme>
        </SocketProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
