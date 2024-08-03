import React from 'react';
import {Box, Typography, List, ListItem, Checkbox, Paper} from '@mui/material';
import './styles/oneColumnWeb.css';
import useTextSettingsStore from "../../store/tests/textSettingsStore";
import ListItemIcon from "@mui/material/ListItemIcon";

interface AnswerOption {
    id: number;
    optionText: string;
    isCorrect: boolean;
}

interface Question {
    id: number;
    questionText: string;
    answerOptions: AnswerOption[];
}

interface Test {
    title: string;
    questions: Question[];
}

interface TestPrintProps {
    test: Test;
}

interface TestPrintContentProps extends TestPrintProps {
    titleFontSize: number;
    questionFontSize: number;
    answerFontSize: number;
    titleFontWeight: number;
    questionFontWeight: number;
}

const TestPrintContent: React.FC<TestPrintContentProps> = ({
                                                               test,
                                                               titleFontSize,
                                                               questionFontSize,
                                                               answerFontSize,
                                                               titleFontWeight,
                                                               questionFontWeight,
                                                           }) => (
    <Box className="center-mode">
        <Typography
            className="test-title"
            style={{ fontSize: `${titleFontSize}px`, fontWeight: titleFontWeight }}
        >
            {test.title}
        </Typography>
        {test.questions.map((question, index) => (
            <Box key={question.id} className="question">
                <Typography
                    className={`question-text`}
                    style={{ fontSize: `${questionFontSize}px`, fontWeight: questionFontWeight }}
                >
                    {index + 1}. {question.questionText}
                </Typography>
                <List>
                    {question.answerOptions.map(option => (
                        <ListItem key={option.id}>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    disabled={true}
                                />
                            </ListItemIcon>
                            <Typography
                                style={{ fontSize: `${answerFontSize}px`}}
                            >
                                {option.optionText}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            </Box>
        ))}
    </Box>
);


export const TestPrint: React.FC<TestPrintProps> = ({ test }) => {
    const {
        titleFontSize,
        questionFontSize,
        answerFontSize,
        titleFontWeight,
        questionFontWeight,
    } = useTextSettingsStore();
    return (
        <>
            <Box>
                <TestPrintContent
                    test={test}
                    titleFontSize={titleFontSize}
                    questionFontSize={questionFontSize}
                    answerFontSize={answerFontSize}
                    titleFontWeight={titleFontWeight}
                    questionFontWeight={questionFontWeight}
                />
            </Box>
        </>
    );
};
