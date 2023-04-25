import { Route } from "react-router-dom";
import Home from "@/pages/Home";
import Service from "@/pages/Service";
import Like from "@/pages/Like";
import NotFound from "@/pages/NotFound";
import UpdateInfo from "@/pages/auth/UpdateInfo";
import Search from "@/pages/Search";
import Auth from "@/pages/auth";

interface Router {
  path: string;
  component: JSX.Element;
}

const listRouter: Router[] = [
  { path: "/", component: <Home /> },
  { path: "/data/:slug", component: <Home /> },
  { path: "/search", component: <Search /> },
  { path: "/service/:id?", component: <Service /> },
  { path: "/register", component: <Auth /> },
  { path: "/login", component: <Auth /> },
  { path: "/like", component: <Like /> },
  { path: "/update-info", component: <UpdateInfo /> },
  { path: "*", component: <NotFound /> },
];

export const renderRouter = () => {
  return listRouter.map((router, index) => {
    return <Route key={index} path={router.path} element={router.component} />;
  });
};
