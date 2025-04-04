import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router";
import { Outlet } from "react-router";

import Footer from "./components/footer";
import { Header } from "./components/header";
import History from "./pages/History";
import SessionProvider from "./components/providers/session-provider";

import Login from "@/pages/Login/Login";
import Home from "@/pages/Home/Home";
import Profile from "@/pages/Profile/Profile";

function AppRouter() {
  const BracketDiv = () => {
    return (
      <div className="mx-auto block max-w-[calc(80rem_+_2rem)] px-[1rem]">
        <Header />
        <Outlet />
        <Footer />
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <ProtectedRoute> */}
        <Route element={<SessionProvider />}>
          <Route element={<BracketDiv />}>
            <Route path="/home" element={<Home />} />
            <Route path="/setting" element={<Profile />} />
            <Route path="/history" element={<History />} />
          </Route>
        </Route>
        {/* </ProtectedRoute> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
