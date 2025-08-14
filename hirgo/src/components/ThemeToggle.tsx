// @ts-ignore
import {useTheme} from "@/providers/ThemeProvider.tsx";
import { Button } from "./ui/button";
import React from "react";

interface ThemeToggleProps {
    className?:string
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({className}) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className={`${className}`}>
            <Button onClick={toggleTheme} className={"w-full"}>
                {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            </Button>
        </div>
    );
};

export default ThemeToggle;
