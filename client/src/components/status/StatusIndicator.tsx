import React from 'react';
import { AccessTime } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {GenerationStatus} from "../../store/types";
import {DoneLabel} from "../utils/DoneLabel";
import {NoLabel} from "../utils/NoLabel";

interface StatusIndicatorProps {
    status: GenerationStatus;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
    switch (status) {
        case GenerationStatus.WAITING:
            return <AccessTime />;
        case GenerationStatus.SUCCESS:
            return <DoneLabel />;
        case GenerationStatus.IN_PROCESS:
            return <CircularProgress size={24} />;
        case GenerationStatus.FAILED:
            return <NoLabel />;
        default:
            return <QuestionMarkIcon />;
    }
};

export default StatusIndicator;
