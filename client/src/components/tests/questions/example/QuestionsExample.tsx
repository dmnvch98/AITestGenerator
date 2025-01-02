import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    Box,
    Fade,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    useTheme,
} from '@mui/material';
import {QuestionType, questionTypeTranslations} from "../../../../store/tests/types";
import questionsData from './questions.json';
import {AnswerOption, Question} from "../../../../store/tests/testStore";
import StatusIndicator from "../../../status/StatusIndicator";
import {GenerationStatus} from "../../../../store/types";

interface QuestionDescription extends Question {
    description: string;
}

interface EnhancedMenuBasedLayoutProps {
    defaultQuestionType?: QuestionType;
}

export default function EnhancedMenuBasedLayout({
                                                    defaultQuestionType,
                                                }: EnhancedMenuBasedLayoutProps) {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [questions, setQuestions] = useState<QuestionDescription[]>([]);
    const theme = useTheme();

    const entries = Object.entries(questionTypeTranslations);

    const selectedLabel = entries[selectedIndex][1];

    const selectedQuestion = questions.find(
        (q) => q.questionType === entries[selectedIndex][0]
    );

    useEffect(() => {
        setQuestions(questionsData as unknown as QuestionDescription[]);
    }, []);

    useEffect(() => {
        if (defaultQuestionType) {
            const foundIndex = entries.findIndex(
                ([key]) => key === defaultQuestionType
            );
            if (foundIndex !== -1) {
                setSelectedIndex(foundIndex);
            }
        }
    }, [defaultQuestionType, entries]);

    const handleListItemClick = (index: number) => {
        setSelectedIndex(index);
    };

    const renderAnswerOptions = (question: Question) => {
        return <AnswersDisplay answerOptions={question.answerOptions} />;
    };

    return (
        <Box sx={{display: 'flex', height: '70vh'}}>
            <Box
                sx={{
                    width: '250px',
                    minWidth: '250px',
                    height: '100%',
                    borderRight: 1,
                    borderColor: 'divider',
                }}
            >
                <List component="nav">
                    {entries.map(([key, label], index) => (
                        <ListItem key={key} disablePadding>
                            <ListItemButton
                                selected={index === selectedIndex}
                                onClick={() => handleListItemClick(index)}
                                sx={{
                                    height: '56px',
                                    '&.Mui-selected': {
                                        backgroundColor: theme.palette.action.selected,
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.selected,
                                        },
                                    },
                                    '&:hover': {
                                        backgroundColor: theme.palette.action.hover,
                                    },
                                    transition: 'background-color 0.3s',
                                }}
                            >
                                <ListItemText primary={label}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Box
                sx={{
                    flexGrow: 1,
                    pt: 2,
                    pr: 4,
                    pb: 4,
                    pl: 4,
                    overflowY: 'auto',
                    minWidth: '600px',
                }}
            >
                <Box
                    sx={{
                        minHeight: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    {selectedQuestion ? (
                        <Fade in timeout={300}>
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    <strong>{selectedLabel}</strong>
                                </Typography>
                                <Typography>
                                    <strong>Описание:</strong>
                                </Typography>
                                <Typography>{selectedQuestion.description}</Typography>
                                <br/>
                                <Typography>
                                    <strong>Пример:</strong>
                                </Typography>
                                <Typography sx={{whiteSpace: 'pre-wrap', mb: 2}}>
                                    {selectedQuestion.questionText}
                                </Typography>
                                {renderAnswerOptions(selectedQuestion)}
                                {selectedQuestion.textReference && (
                                    <Typography
                                        variant="body2"
                                        sx={{mt: 2, fontStyle: 'italic'}}
                                    >
                                        {selectedQuestion.textReference}
                                    </Typography>
                                )}
                            </Box>
                        </Fade>
                    ) : (
                        <Typography>Нет данных для выбранного типа вопроса.</Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

const AnswersDisplay: React.FC<{ answerOptions: AnswerOption[] }> = ({ answerOptions }) => {
    return (
        <Grid container spacing={2}>
            {answerOptions.map((option) => (
                <Grid item xs={12} key={option.id}>
                    <Box display="flex" alignItems="flex-start">
                        {option.correct ? (
                            <StatusIndicator status={GenerationStatus.SUCCESS} />
                        ) : (
                            <StatusIndicator status={GenerationStatus.FAILED} />
                        )}
                        <Typography component="span" sx={{ ml: 2, mt: 0.15 }}>
                            {option.optionText}
                        </Typography>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};
