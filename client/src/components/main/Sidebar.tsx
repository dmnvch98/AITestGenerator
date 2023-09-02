import React from "react";
import {Link, useLocation} from "react-router-dom";
import {Paper, Tab, Tabs} from "@mui/material";

export const Sidebar = () => {
    const location = useLocation();

    // Функция для определения активной вкладки на основе текущего URL
    const isActiveTab = (tab: string) => {
        return location.pathname.includes(tab.toLowerCase());
    };

    return (
        <Paper>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={location.pathname}
                aria-label="Sidebar navigation"
            >
                <Tab
                    label="Tests"
                    value="/tests"
                    component={Link}
                    to="/tests"
                    className={isActiveTab("Tests") ? "active" : ""}
                />
                <Tab
                    label="Chapters"
                    value="/chapters"
                    component={Link}
                    to="/chapters"
                    className={isActiveTab("Chapters") ? "active" : ""}
                />
                <Tab
                    label="Balance"
                    value="/balance"
                    component={Link}
                    to="/balance"
                    className={isActiveTab("Balance") ? "active" : ""}
                />
                <Tab
                    label="Settings"
                    value="/settings"
                    component={Link}
                    to="/settings"
                    className={isActiveTab("Settings") ? "active" : ""}
                />
            </Tabs>
        </Paper>
    );
};

