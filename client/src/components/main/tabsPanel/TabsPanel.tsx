import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { CustomTabPanel } from "./CustomTabPanel";

export interface TabItem {
    children?: React.ReactNode;
    index: number;
    value: number;
    title: string;
}

export interface TabsPanelProps {
    tabs: TabItem[];
    activeTab: number;
    onTabChange: (newValue: number) => void;
}

export const TabsPanel: React.FC<TabsPanelProps> = ({ tabs, activeTab, onTabChange }) => {

    const a11yProps = (index: number) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        onTabChange(newValue); // Обновляем активную вкладку через коллбэк
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%'}}>
                <Tabs value={activeTab} onChange={handleChange} aria-label="dynamic tabs example">
                    {tabs.map((tab, index) => (
                        <Tab label={tab.title} {...a11yProps(index)} key={index} />
                    ))}
                </Tabs>
            </Box>
            {tabs.map((tab, index) => (
                <CustomTabPanel value={activeTab} index={index} key={index}>
                    {tab.children}
                </CustomTabPanel>
            ))}
        </Box>
    );
};
