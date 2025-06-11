import React, { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeContextProvider = ({children}) => {
    const [theme, setTheme] = useState("light");

    const toogleTheme = () => {
        setTheme(prev =>  prev === "light" ? "dark" : "light")
    };

    let themeColors = {
        light:{
            color:"black",
            background: "white",
            boxShadow:'0 4px 10px rgba(0, 0, 0, 0.06)' 
        },
        dark:{
            color:"white",
            background:"black",
            boxShadow: '0 1px 10px rgb(255 248 248 / 10%)'
        }
    };

    return (
        <ThemeContext.Provider value= {{theme, themeColors, toogleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
};