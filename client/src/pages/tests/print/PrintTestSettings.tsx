import React from "react";
import {Box, Divider, FormControl, FormControlLabel, FormGroup, Slider, Switch, Typography} from "@mui/material";
import useTextSettingsStore from "../../../store/tests/testPrintStore";
import ReactToPrint from "react-to-print";
import {useNavigate} from "react-router-dom";
import {ActionIcon} from "../../../store/types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import {getActionItem} from "../../../components/main/data-display/helper";
import List from "@mui/material/List";
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

interface TestPrintActionsProps {
    printRef: React.RefObject<HTMLDivElement>;
    handleReturn: () =>  void;
}

export const PrintTestSettings: React.FC<TestPrintActionsProps> = ({printRef, handleReturn}) => {
    const {
        titleFontSize,
        setTitleFontSize,
        questionFontSize,
        setQuestionFontSize,
        answerFontSize,
        setAnswerFontSize,
        titleFontWeight,
        setTitleFontWeight,
        questionFontWeight,
        setQuestionFontWeight,
        lineHeight,
        setLineHeight,
        showAnswers,
        setShowAnswers,
        showHeader,
        setShowHeader,
    } = useTextSettingsStore();

    const navigate = useNavigate();

    const handleShowAnswers = () => {
        setShowAnswers(!showAnswers);
    }

    const handleShowHeader = () => {
        setShowHeader(!showHeader);
    }

    const handleExit = () => {
        navigate("/tests");
    }

    const actionItemPrint: ActionIcon = {
        name: 'Печать',
        icon: <PrintIcon/>,
        onClick: () => {},
    }

    const actions: ActionIcon[] = [
        {
            name: 'Выйти',
            icon: <ExitToAppOutlinedIcon/>,
            onClick: handleExit
        },
        {
            name: 'Вернуться',
            icon: <ArrowBackIcon/>,
            onClick: handleReturn
        },
    ]

    return (
        <Box sx={{width: '100%', textAlign: 'start'}}>
            <List sx={{ ml: -1, mt: -2 }}>
                <ReactToPrint
                    trigger={() => getActionItem(actionItemPrint)}
                    content={() => printRef.current}
                />
                {actions.map(action => (
                    getActionItem(action)
                ))}
            </List>
            <Divider sx={{mb: 2}}/>

            <Box sx={{width: '100%', textAlign: 'start'}}>
                <FormGroup>
                    <FormControlLabel
                        control={<Switch checked={showAnswers} onChange={handleShowAnswers}/>}
                        label="Показать ответы"
                    />
                </FormGroup>
                <FormGroup>
                    <FormControlLabel
                        control={<Switch checked={showHeader} onChange={handleShowHeader}/>}
                        label="Шапка теста"
                    />
                </FormGroup>

                <Divider sx={{mb: 1, mt: 2}}/>

                <Typography variant="subtitle1" gutterBottom fontWeight="600">Размер</Typography>
                <FormControl fullWidth sx={{display: showHeader ? 'block' : 'none'}}>
                    <Typography>Шапка теста</Typography>
                    <Slider
                        value={titleFontSize}
                        onChange={(e, newValue) => setTitleFontSize(newValue as number)}
                        step={1}
                        min={14}
                        max={20}
                        valueLabelDisplay="auto"
                        marks
                        size="small"
                    />
                </FormControl>
                <FormControl fullWidth>
                    <Typography>Вопрос</Typography>
                    <Slider
                        value={questionFontSize}
                        onChange={(e, newValue) => setQuestionFontSize(newValue as number)}
                        step={1}
                        min={12}
                        max={16}
                        valueLabelDisplay="auto"
                        marks
                        size="small"
                    />
                </FormControl>
                <FormControl fullWidth sx={{mt: 2}}>
                    <Typography>Ответ</Typography>
                    <Slider
                        value={answerFontSize}
                        onChange={(e, newValue) => setAnswerFontSize(newValue as number)}
                        step={1}
                        min={12}
                        max={16}
                        valueLabelDisplay="auto"
                        marks
                        size="small"
                    />
                </FormControl>
            </Box>

            <Box>
                <Typography variant="subtitle1" gutterBottom fontWeight="600">Жирность</Typography>
                <FormControl fullWidth sx={{display: showHeader ? 'block' : 'none'}}>
                    <Typography>Заголовок</Typography>
                    <Slider
                        value={titleFontWeight}
                        onChange={(e, newValue) => setTitleFontWeight(newValue as number)}
                        step={100}
                        min={400}
                        max={600}
                        valueLabelDisplay="auto"
                        marks
                        size="small"
                    />
                </FormControl>
                <FormControl fullWidth>
                    <Typography>Вопрос</Typography>
                    <Slider
                        value={questionFontWeight}
                        onChange={(e, newValue) => setQuestionFontWeight(newValue as number)}
                        step={100}
                        min={400}
                        max={600}
                        valueLabelDisplay="auto"
                        marks
                        size="small"
                    />
                </FormControl>
            </Box>

            <Box>
                <Typography variant="subtitle1" gutterBottom fontWeight="600">Высота отступов</Typography>
                <FormControl fullWidth>
                    <Slider
                        value={lineHeight}
                        onChange={(e, newValue) => setLineHeight(newValue as number)}
                        step={1}
                        min={1}
                        max={10}
                        valueLabelDisplay="auto"
                        marks
                        size="small"
                    />
                </FormControl>
            </Box>
        </Box>
    );
};
