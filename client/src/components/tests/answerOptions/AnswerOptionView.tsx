import { ListItem } from "@mui/material";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { AnswerOption } from "../../../store/tests/testStore";
import Divider from "@mui/material/Divider";

export const AnswerOptionView = ({ answerOption, isLast }: { answerOption: AnswerOption, isLast: boolean }) => {
    const secondaryTextColor = answerOption.isCorrect ? '#006400' : '#f50057';

    const secondaryTextStyle = {
        color: secondaryTextColor,
    };

    return (
        <List>
            <ListItem sx={{ pl: 4, pr: 4 }}>
                <ListItemText
                    primary={answerOption.optionText}
                    secondary={
                        <span style={secondaryTextStyle}>
                            {answerOption.isCorrect ? 'верно' : 'неверно'}
                        </span>
                    }
                />
            </ListItem>
            {!isLast && <Divider />}
        </List>
    );
};
