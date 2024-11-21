import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tooltip, CircularProgress, Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Rating from '@mui/material/Rating';
import {useTestStore} from '../../../../store/tests/testStore';

const highlightStyle = '0 0 5px 1px rgba(163, 204, 190, 0.8)';

const RatingInput: React.FC<{
    rating: number;
    feedback: string | undefined;
    onRatingChange: (newRating: number) => void;
    onFeedbackChange: (feedback: string) => void;
    onSubmit: () => void;
    onExit: () => void;
}> = ({rating, feedback, onRatingChange, onFeedbackChange, onSubmit, onExit}) => (
    <Box sx={{boxShadow: rating === 0 ? highlightStyle : 'none'}}>
        <Accordion defaultExpanded>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="rating-content"
                id="rating-header"
            >
                <Typography variant="subtitle1" component="div">
                    Оцените тест
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box sx={{maxWidth: 400}}>
                    <Box sx={{textAlign: 'left', mt: -2}}>
                        <Rating
                            name="test-rating"
                            value={rating}
                            onChange={(_, newRating) => onRatingChange(newRating!)}
                            size="medium"
                            precision={1}
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
                                onChange={(e) => onFeedbackChange(e.target.value)}
                                variant="outlined"
                                InputLabelProps={{shrink: true}}
                                sx={{
                                    '& .MuiInputBase-input': {
                                        fontSize: '14px',
                                    },
                                }}
                            />
                        </Box>
                    )}

                    <Box mt={2}>
                        <Tooltip
                            title={rating === 0 ? "Пожалуйста, поставьте оценку перед отправкой." : ""}
                            arrow
                            disableHoverListener={rating !== 0}
                        >
                        <span>
                            <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={onSubmit}
                                fullWidth
                                disabled={rating === 0}
                            >
                                Отправить
                            </Button>
                        </span>
                        </Tooltip>
                        {rating > 0 &&
                            <Button
                                size="small"
                                variant="outlined"
                                color="secondary"
                                onClick={onExit}
                                fullWidth
                                sx={{mt: 1.5}}
                            >
                                Выйти
                            </Button>}
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    </Box>
);

const RatingDisplay: React.FC<{
    rating: number;
    onEdit: () => void;
}> = ({rating, onEdit}) => (
    <Box>
        <Divider sx={{mb: 3}}/>
        <Box sx={{textAlign: 'left'}}>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Typography variant="subtitle2" sx={{mr: 1}}>
                    Рейтинг:
                </Typography>
                <Rating name="read-only" value={rating} readOnly size="small"/>
            </Box>
            <Button
                variant="outlined"
                color="primary"
                onClick={onEdit}
                size="small"
                sx={{mt: 2, width: '100%'}}>
                Изменить
            </Button>
        </Box>
    </Box>
);

interface TestRatingFormProps {
    id: number;
    loading: boolean;
}

export const TestRatingForm: React.FC<TestRatingFormProps> = ({id, loading}) => {
    const {updateRating, selectedTestRating} = useTestStore();
    const [rating, setRating] = useState<number>(selectedTestRating?.rating ?? 5);
    const [feedback, setFeedback] = useState<string | undefined>(undefined);
    const [isEditing, setIsEditing] = useState<boolean>(true);

    useEffect(() => {
        if (selectedTestRating) {
            setRating(selectedTestRating.rating);
            setFeedback(selectedTestRating.feedback);
            setIsEditing(false);
        } else {
            setRating(0);
            setFeedback(undefined);
            setIsEditing(true);
        }
    }, [selectedTestRating]);

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
    };

    const handleFeedbackChange = (feedback: string) => {
        setFeedback(feedback);
    };

    const handleSubmit = () => {
        rating === 5 && setFeedback(undefined);
        updateRating(id, {rating, feedback});
        setIsEditing(!isEditing);
    };

    const toggleEdit = () => {
        setRating(selectedTestRating?.rating ?? 0);
        setIsEditing(!isEditing);
    }

    return (
        loading ? (
            <Box sx={{height: '270px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <CircularProgress/>
            </Box>

        ) : (
            <Box>
                {isEditing ? (
                    <RatingInput
                        rating={rating}
                        feedback={feedback}
                        onRatingChange={handleRatingChange}
                        onFeedbackChange={handleFeedbackChange}
                        onSubmit={handleSubmit}
                        onExit={toggleEdit}
                    />
                ) : (
                    <RatingDisplay
                        rating={rating}
                        onEdit={toggleEdit}
                    />
                )}
            </Box>
        )
    );
};
