import { Outlet } from 'react-router-dom';
import Header from "./Header";
import { RoomSelectorPage } from "./RoomSelectorPage";

const Layout = () => {
  return (
    <>
      <Header />
      <div style={{ display: "flex", flexDirection: "row", height: "calc(100vh - 60px)" }}>
        <div style={{ width: '300px', borderRight: '1px solid #ddd', padding: '10px', overflowY: 'auto' }}>
          <RoomSelectorPage />
        </div>

        <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
