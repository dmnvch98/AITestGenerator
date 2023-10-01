import React, {useEffect, useState} from "react";
import {Box, FormControlLabel, IconButton, Switch, TextField, Tooltip} from "@mui/material";
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import {useTestStore} from "../../store/tests/testStore";

export const GenerateTestAskGroup = () => {
    const [secondSwitch, setSecondSwitch] = useState(false);

    const maxValue = useTestStore(state => state.maxQuestionsNumber);
    const setMaxValue = useTestStore(state => state.setMaxQuestionsNumber);
    const generateTestValidationErrorFlag = useTestStore(state => state.generateTestValidationErrorFlag);
    const setGenerateTestValidationErrorFlag = useTestStore(state => state.setGenerateTestValidationErrorFlag);

    const handleSecondSwitchChange = () => {
        setSecondSwitch(!secondSwitch);
    };

    const handleMaxValueChange = (e: any) => {
        const newValue = parseFloat(e.target.value);
        const isValid = newValue >= 0 && !isNaN(newValue);

        setMaxValue(newValue);
        setGenerateTestValidationErrorFlag(!isValid);
    };

    const additionalQuestionsHint = () => {
        return (
            <Tooltip title="Generating text-independent questions based on the title">
                <IconButton size="small">
                    <HelpOutlineRoundedIcon/>
                </IconButton>
            </Tooltip>
        )
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="flex-start" width="40vw">
            <FormControlLabel
                control={
                    <Box display="flex">
                        <TextField
                            variant="outlined"
                            type="number"
                            value={maxValue}
                            onChange={handleMaxValueChange}
                            size="small"
                            error={generateTestValidationErrorFlag}

                            sx={{ml: 1, width: "7vw"}}
                        />
                    </Box>
                }
                label="Max questions number"
                labelPlacement="start"
                sx={{marginLeft: 0, flex: 1}}
            />
            <FormControlLabel
                control={<Switch checked={secondSwitch} onChange={handleSecondSwitchChange}/>}
                label={
                    <>
                        Additional questions
                        {additionalQuestionsHint()}
                    </>
                }
                labelPlacement="start"
                sx={{marginLeft: 0, marginTop: 2}}
            />
        </Box>

    );
};
