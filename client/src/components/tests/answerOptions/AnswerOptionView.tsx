import { ListItem } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { AnswerOption } from "../../../store/tests/testStore";
import Box from "@mui/material/Box";

export const AnswerOptionView = ({ answerOption }: { answerOption: AnswerOption }) => {
    const secondaryTextColor = answerOption.correct ? '#006400' : '#f50057';

    const secondaryTextStyle = {
        color: secondaryTextColor,
    };

    return (
        <Box>
            <ListItem sx={{ pl: 4, pr: 4 }}>
                <ListItemText
                    primary={answerOption.optionText}
                    secondary={
                        <span style={secondaryTextStyle}>
                            {answerOption.correct ? 'верно' : 'неверно'}
                        </span>
                    }
                />
            </ListItem>
        </Box>
    );
};
