import "./App.css";
import MainLayout from "@/layouts/MainLayout";
import { BrowserRouter, Routes } from "react-router-dom";
import { renderRouter } from "./router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      {/* Toast Notification */}
      <ToastContainer
        theme="colored"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
      />

      {/* Layout */}
      <MainLayout>
        <Routes>{renderRouter()}</Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default App;
