// LoadingButton.tsx
import React, {useMemo} from 'react';
import {Button, ButtonProps, CircularProgress} from '@mui/material';

interface LoadingButtonProps extends ButtonProps {
    loading: boolean;
    disabled?: boolean;
    label: string;
    loadingLabel?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
                                                         loading = false,
                                                         label,
                                                         loadingLabel = "Загрузка...",
                                                         disabled,

                                                         ...props
                                                     }) => {

    const buttonLabel = useMemo(() => {
        return loading ? loadingLabel : label;
    }, [loading])
    const renderContent = () => {
        if (loading) {
            return <CircularProgress size={24} color="inherit"/>;
        }
    };

    return (
        <Button {...props} disabled={loading || disabled} startIcon={renderContent()}>
            {buttonLabel}
        </Button>
    );
};

export default LoadingButton;
