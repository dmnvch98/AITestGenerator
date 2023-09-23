import {ListItem} from "@mui/material";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import {AnswerOption} from "../../../store/tests/testStore";
import Divider from "@mui/material/Divider";

export const AnswerOptionView = ({answerOption}: { answerOption: AnswerOption }) => {
    const secondaryTextColor = answerOption.isCorrect ? '#006400' : '#f50057';

    const secondaryTextStyle = {
        color: secondaryTextColor,
    };

    return (
        <List>
            <ListItem>
                <ListItemText
                    primary={answerOption.optionText}
                    secondary={
                        <span style={secondaryTextStyle}>
                            {answerOption.isCorrect ? 'correct' : 'incorrect'}
                        </span>
                    }
                />
            </ListItem>
            <Divider/>
        </List>
    )
}