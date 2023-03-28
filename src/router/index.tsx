import { Route } from "react-router-dom";
import Home from "@/pages/Home";
import Service from "@/pages/Service";
import Register from "@/pages/auth/Register";
import Login from "@/pages/auth/Login";
import Like from "@/pages/Like";
import NotFound from "@/pages/NotFound";
import UpdateInfo from "@/pages/auth/UpdateInfo";

interface Router {
  path: string;
  component: JSX.Element;
}

const listRouter: Router[] = [
  { path: "/", component: <Home /> },
  { path: "/service/:id?", component: <Service /> },
  { path: "/register", component: <Register /> },
  { path: "/login", component: <Login /> },
  { path: "/like", component: <Like /> },
  { path: "/update-info", component: <UpdateInfo /> },
  { path: "*", component: <NotFound /> },
];

export const renderRouter = () => {
  return listRouter.map((router, index) => {
    return <Route key={index} path={router.path} element={router.component} />;
  });
};
