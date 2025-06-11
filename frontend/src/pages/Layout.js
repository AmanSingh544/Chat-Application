import { Outlet } from 'react-router-dom';
import Header from "./Header";
import { RoomSelectorPage } from "./RoomSelectorPage";
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Layout = () => {

  const themeContext = useContext(ThemeContext);
  const themeColor = themeContext.theme === "light" ? themeContext.themeColors.light : themeContext.themeColors.dark;
  return (
    <>
      <Header />
      <div style={{ display: "flex", flexDirection: "row", height: "calc(100vh - 60px)" }}>
        <div style={{ width: '300px', background:themeColor.background,color: themeColor.color,  borderRight: '1px solid #ddd', padding: '10px', overflowY: 'auto' }}>
          <RoomSelectorPage />
        </div>

        <div style={{ flex: 1, margin: '5px', overflowY: 'auto' }}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
