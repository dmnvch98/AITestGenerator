import React from "react";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AccessTime from "@mui/icons-material/AccessTime";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import HelpIcon from "@mui/icons-material/Help";
import {GenerationStatus, getStatusHint} from "../../store/types";
import CircularProgressWithLabel from "./CircularProgressWithLabel";

interface StatusIndicatorProps {
    status: GenerationStatus;
    readyPercentage?: number;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, readyPercentage }) => {
    const renderStatusIcon = () => {
        switch (status) {
            case GenerationStatus.WAITING:
                return (
                    <Typography color="orange">
                        <AccessTime />
                    </Typography>
                );
            case GenerationStatus.SUCCESS:
                return (
                    <Typography color="darkgreen">
                        <DoneIcon />
                    </Typography>
                );
            case GenerationStatus.IN_PROCESS:
                return <CircularProgressWithLabel value={Math.round(readyPercentage || 0)}/>;
            case GenerationStatus.FAILED:
                return (
                    <Typography color="red">
                        <CloseIcon />
                    </Typography>
                );
            default:
                return (
                    <Typography color="gray">
                        <HelpIcon />
                    </Typography>
                );
        }
    };

    return (
        <Tooltip title={getStatusHint(status)}>
            <span>{renderStatusIcon()}</span>
        </Tooltip>
    );
};

export default StatusIndicator;
