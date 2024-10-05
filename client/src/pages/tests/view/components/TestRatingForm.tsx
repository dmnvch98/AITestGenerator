import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Rating from '@mui/material/Rating';
import { useTestStore } from "../../../../store/tests/testStore";

interface TestRatingFormProps {
    id: number;
}

const TestRatingForm: React.FC<TestRatingFormProps> = ({ id }) => {
    const { updateRating, selectedTestRating } = useTestStore();
    const [rating, setRating] = useState<number>(5);
    const [feedback, setFeedback] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (selectedTestRating) {
            setRating(selectedTestRating.rating);
            setFeedback(selectedTestRating.feedback);
        } else {
            setRating(5);
            setFeedback(undefined);
        }
    }, [selectedTestRating]);

    const handleRatingChange = (_event: React.ChangeEvent<{}>, newRating: number | null) => {
        if (newRating !== null) {
            setRating(newRating);
        }
    };

    const handleFeedbackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFeedback(event.target.value);
    };

    const handleSubmit = () => {
        updateRating(id, { rating, feedback });
    };

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="rating-content"
                id="rating-header"
            >
                <Typography variant="subtitle1" component="div">
                    Оцените тест
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box sx={{ maxWidth: 400 }}>
                    <Box sx={{ textAlign: 'left', mt: -2 }}>
                        <Rating
                            name="test-rating"
                            value={rating}
                            onChange={handleRatingChange}
                            size="medium"
                            precision={0.5}
                        />
                    </Box>

                    {rating !== null && rating < 5 && (
                        <Box mt={2}>
                            <TextField
                                fullWidth
                                label="Отзыв"
                                placeholder="Поле необязательное"
                                multiline
                                rows={3}
                                value={feedback}
                                onChange={handleFeedbackChange}
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    "& .MuiInputBase-input": {
                                        fontSize: "14px",
                                    }
                                }}
                            />
                        </Box>
                    )}

                    <Box mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            fullWidth
                        >
                            Отправить
                        </Button>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default TestRatingForm;
