import React from 'react';
import {Box, CircularProgress, Divider, Pagination, PaginationItem, Typography} from "@mui/material";

interface QuestionPaginationProps {
    currentIndex: number;
    totalQuestions: number;
    onChange: (page: number) => void;
    invalidQuestionNumbers: number[];
    loading?: boolean;
}

export const QuestionPagination: React.FC<QuestionPaginationProps> = ({
                                                                          currentIndex,
                                                                          totalQuestions,
                                                                          onChange,
                                                                          invalidQuestionNumbers,
                                                                          loading
                                                                      }) => {
    return (
        <Box>
            <Divider sx={{mb: 3}}/>
            <Typography align="left" variant="subtitle2" sx={{mb: 1}}>Номер вопроса:</Typography>
            {
                loading ? (
                        <Box sx={{height: '96px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <CircularProgress/>
                        </Box>
                    ) :
                    (
                        <Pagination
                            count={totalQuestions}
                            page={currentIndex + 1}
                            onChange={(_, page) => onChange(page - 1)}
                            variant="outlined"
                            shape="rounded"
                            sx={{display: 'flex', justifyContent: 'center'}}
                            hidePrevButton
                            hideNextButton
                            boundaryCount={totalQuestions}
                            siblingCount={totalQuestions}
                            renderItem={(item) => (
                                <PaginationItem
                                    {...item}
                                    sx={{
                                        ...(invalidQuestionNumbers.includes(item.page as number) && {
                                            color: 'black',
                                            border: '2px solid #ff604f'
                                        })
                                    }}
                                />
                            )}
                        />
                    )
            }

        </Box>
    );
};
