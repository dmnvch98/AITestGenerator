import React, {useEffect} from 'react';
import {Box, Typography, List, ListItem, Checkbox, Grid, Divider} from '@mui/material';
import './styles/oneColumn.css';
import useTextSettingsStore from "../../store/tests/testPrintStore";
import {useTestStore} from "../../store/tests/testStore";
import {useParams} from "react-router-dom";
import {useUserStore} from "../../store/userStore";

interface TestHeaderProps {
    testTitle: string;
    titleFontSize: number;
    titleFontWeight: number;
}

const TestHeader: React.FC<TestHeaderProps> = ({ testTitle, titleFontWeight, titleFontSize }) => {
    return (
        <Grid container alignItems="start" textAlign="left" borderBottom="1px solid #999" sx={{mb: 2, pb: '0.5cm'}}>
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
                <Grid container sx={{mt: 1}} spacing={1}>
                    <Grid item xs={3}>
                        <Typography style={{ fontSize: `${titleFontSize - 2 }px`, textAlign: 'right' }}>
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
        showAnswers,
        showHeader
    } = useTextSettingsStore();
    const {selectedTest, getUserTestById} = useTestStore();

    useEffect(() => {
        setLoading(true);
        getUserTestById(Number(id));
        setLoading(false);
    }, []);

    return (
        <>
            <Box className="center-mode">
                {showHeader && <TestHeader testTitle={selectedTest?.title as string} titleFontSize={titleFontSize} titleFontWeight={titleFontWeight}/>}

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
                            {index + 1}. {question.questionText}
                        </Typography>
                        <List disablePadding>
                            {question.answerOptions.map(option => (
                                <ListItem key={option.id}
                                          sx={{alignItems: 'flex-start', pl: 2, pr: 1, mt: `${lineHeight}px`}}
                                          disablePadding>
                                    <Checkbox
                                        edge="start"
                                        checked={showAnswers && option.isCorrect}
                                        disabled={true}
                                        sx={{
                                            '& .MuiSvgIcon-root': {
                                                color: '#333',
                                                fontSize: `${answerFontSize}px`
                                            },
                                            marginTop: -0.7
                                        }}
                                    />
                                    <Typography
                                        style={{fontSize: `${answerFontSize}px`, textAlign: 'justify'}}
                                    >
                                        {option.optionText}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                ))}

            </Box>
        </>
    )
}
