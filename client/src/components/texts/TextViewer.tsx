import {Box, Paper, Typography} from "@mui/material";
import React from "react";
import {useTextStore} from "../../store/textStore";


export const TextViewer = () => {
    const text = useTextStore((state) => state.selectedText);
    const parse = require('html-react-parser');

    return (
        <>
            <Paper sx={{p: 2}}>
                <Box>
                    <Typography variant='h4' align='left'>{text?.title}</Typography>
                </Box>
                <Typography gutterBottom align='left' sx={{mt: 4}}>
                    {typeof text?.content === 'string' ? parse(text?.content) : null}
                </Typography>
            </Paper>
        </>
    );
};

