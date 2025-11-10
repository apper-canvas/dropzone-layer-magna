import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;