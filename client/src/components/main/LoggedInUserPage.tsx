import { SidebarHeader } from "./SidebarHeader";
import {Alert, Box, CircularProgress, Container, Slide, Snackbar} from "@mui/material";
import {useNotificationStore} from "../../store/notificationStore";
import React from "react";

export const LoggedInUserPage = ({ mainContent }: any) => {

    const getAlertIcon = (icon?: string): React.ReactNode => {
        if (icon && icon === 'progress') {
            return <CircularProgress size={20} color="inherit" />;
        }
        return undefined;
    };

    const {alerts, deleteAlert, clearAlerts} = useNotificationStore();
    return (
        <>
           <SidebarHeader>
               <Container maxWidth="lg" sx={{mb: 4}}>
                   <>
                       {mainContent}
                       <Snackbar
                           anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                           open={alerts.length > 0}
                           autoHideDuration={16000}
                           TransitionComponent={Slide}
                           onClose={clearAlerts}
                       >
                           <Box sx={{ width: '400px' }}>
                               {alerts.map(alert => (
                                   <Alert key={alert.id} severity={alert.severity} sx={{ mb: 0.5, textAlign: 'left' }} icon={getAlertIcon(alert.icon)}
                                          onClose={alert.closeable ? () => deleteAlert(alert) : undefined}>
                                       <span dangerouslySetInnerHTML={{ __html: alert.message }} />
                                   </Alert>
                               ))}
                           </Box>
                       </Snackbar>
                   </>

               </Container>
           </SidebarHeader>
        </>
    );
};
