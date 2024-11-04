import React from "react";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AccessTime from "@mui/icons-material/AccessTime";
import DoneIcon from "@mui/icons-material/Done";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import HelpIcon from "@mui/icons-material/Help";
import {GenerationStatus, getStatusHint} from "../../store/types";

interface StatusIndicatorProps {
    status: GenerationStatus;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
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
                return <CircularProgress size={24} />;
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
