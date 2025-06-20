import { Outlet } from 'react-router-dom';
import Header from "./Header";
import { RoomSelectorPage } from "./RoomSelectorPage";
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import Sidebar from './Sidebar';

const Layout = () => {

  const themeContext = useContext(ThemeContext);
  const themeColor = themeContext.theme === "light" ? themeContext.themeColors.light : themeContext.themeColors.dark;
  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
        <div style={{ width: '300px', background:themeColor.background,color: themeColor.color,  borderRight: '1px solid #ddd', padding: '10px', overflowY: 'auto', maxHeight:'100vh' }}>
          <Sidebar />
          {/* <RoomSelectorPage /> */}
        </div>

        <div style={{ flex: 1, margin: '5px', overflowY: 'auto' }}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
