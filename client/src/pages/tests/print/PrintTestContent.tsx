import React, { useEffect } from 'react';
import { Box, Divider, Grid, Typography } from '@mui/material';
import '../styles/oneColumn.css';
import useTextSettingsStore from '../../../store/tests/testPrintStore';
import { useTestStore } from '../../../store/tests/testStore';
import { useParams } from 'react-router-dom';
import { useUserStore } from '../../../store/userStore';
import {questionTypeFlags} from "../../../store/tests/types";

interface TestHeaderProps {
    testTitle: string;
    titleFontSize: number;
    titleFontWeight: number;
}

const TestHeader: React.FC<TestHeaderProps> = ({ testTitle, titleFontWeight, titleFontSize }) => {
    return (
        <Grid container alignItems="start" textAlign="left" borderBottom="1px solid #999" sx={{ mb: 2, pb: '0.5cm' }}>
            <Grid item xs={6}>
                <Typography style={{ fontSize: `${titleFontSize}px`, fontWeight: titleFontWeight }}>
                    {testTitle}
                </Typography>
            </Grid>
            <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: "#999" }} />
            <Grid item xs={5}>
                <Grid container spacing={1}>
                    <Grid item xs={3}>
                        <Typography style={{ fontSize: `${titleFontSize - 2}px`, textAlign: 'right' }}>
                            ФИО
                        </Typography>
                    </Grid>
                    <Grid item xs={9} textAlign="left">
                        ______________________________
                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 1 }} spacing={1}>
                    <Grid item xs={3}>
                        <Typography style={{ fontSize: `${titleFontSize - 2}px`, textAlign: 'right' }}>
                            Группа
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        ______________________________
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

const getAnswerWord = (count: number): string => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return 'ответов';
    }
    if (lastDigit === 1) {
        return 'ответ';
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
        return 'ответа';
    }
    return 'ответов';
};

export const PrintTestContent = () => {
    const { id } = useParams();
    const { setLoading } = useUserStore();
    const {
        titleFontSize,
        questionFontSize,
        answerFontSize,
        titleFontWeight,
        questionFontWeight,
        lineHeight,
        showHeader,
        showAnswers
    } = useTextSettingsStore();
    const { selectedTest, getUserTestById, clearState } = useTestStore();

    const fetchTest = async () => {
        setLoading(true);
        await getUserTestById(Number(id));
        setLoading(false);
    };

    useEffect(() => {
        fetchTest();
    }, []);

    useEffect(() => {
        return () => {
            clearState();
        };
    }, []);

    return (
        <>
            <Box className="center-mode">
                {showHeader && <TestHeader testTitle={selectedTest?.title as string} titleFontSize={titleFontSize} titleFontWeight={titleFontWeight} />}

                {selectedTest?.questions.map((question, index) => (
                    <Box key={question.id} className="question">
                        <Typography
                            className={`question-text`}
                            sx={{
                                fontSize: `${questionFontSize}px`,
                                fontWeight: questionFontWeight,
                                mt: `${lineHeight}px`,
                                mb: `${lineHeight + 1}px`
                            }}
                        >
                            {`${index + 1}. ${question.questionText}`} {questionTypeFlags[question.questionType]?.singleAnswer
                            ? ''
                            : `(${question.answerOptions.filter(option => option.correct).length} ${getAnswerWord(question.answerOptions.filter(option => option.correct).length)})`}
                        </Typography>
                        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1} sx={{ mt: `${lineHeight}px` }}>
                            {question.answerOptions.map((option, optionIndex) => (
                                <Typography
                                    key={option.id}
                                    style={{ fontSize: `${answerFontSize}px`, textAlign: 'justify' }}
                                >
                                    {showAnswers && option.correct ? (
                                        <><strong>{`${String.fromCharCode(97 + optionIndex)}) `}</strong>{option.optionText}</>
                                    ) : (
                                        <>{`${String.fromCharCode(97 + optionIndex)}) `}{option.optionText}</>
                                    )}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                ))}
            </Box>
        </>
    );
};
