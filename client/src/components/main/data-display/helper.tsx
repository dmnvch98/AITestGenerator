import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import React from "react";
import { ActionIcon } from "../../../store/types";
import {v4 as uuidv4} from "uuid";

export const getActionItemsList = (actions: ActionIcon[]) => {
    return (
        <List sx={{ ml: -1 }}>
            {actions.map((a, index) => (
                getActionItem(a)
                // <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                //     <ListItemButton
                //         disabled={a.disabled}
                //         sx={{
                //             minHeight: 48,
                //             justifyContent: 'center',
                //             backgroundColor: 'inherit',
                //         }}
                //         onClick={a.onClick} // Перенесено сюда для упрощения
                //     >
                //         <ListItemIcon
                //             sx={{
                //                 minWidth: 0,
                //                 mr: 3,
                //                 justifyContent: 'center',
                //             }}
                //         >
                //             {a.icon}
                //         </ListItemIcon>
                //         <ListItemText primary={a.name} sx={{ opacity: 1 }} />
                //     </ListItemButton>
                // </ListItem>
            ))}
        </List>
    );
}

export const getActionItem = (action: ActionIcon) => {
    return (
        <ListItem key={uuidv4()} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
                disabled={action.disabled}
                sx={{
                    minHeight: 48,
                    justifyContent: 'center',
                    backgroundColor: 'inherit',
                }}
                onClick={action?.onClick}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: 'center',
                    }}
                >
                    {action.icon}
                </ListItemIcon>
                <ListItemText primary={action.name} sx={{ opacity: 1 }} />
            </ListItemButton>
        </ListItem>
    )
}