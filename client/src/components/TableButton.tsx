import {Button} from "@mui/material";
import * as React from "react";

type ButtonProps = {
    name: string
}
export const TableButton: React.FC<ButtonProps> = ({name}) => {
    return (
        <>
            <Button sx={{width: '15%'}}>{name}</Button>
        </>
    )
}