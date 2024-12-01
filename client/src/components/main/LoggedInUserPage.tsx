import { SidebarHeader } from "./SidebarHeader";
import {Alert, Box, Container, Slide, Snackbar} from "@mui/material";
import {useNotificationStore} from "../../store/notificationStore";
import React from "react";
import NotificationService from "../../services/notification/NotificationService";

export const LoggedInUserPage = ({ mainContent }: any) => {
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
                           autoHideDuration={6000}
                           TransitionComponent={Slide}
                           onClose={clearAlerts}
                       >
                           <Box sx={{ maxWidth: '400px' }}>
                               {alerts.map(alert => (
                                   <Alert key={alert.id} severity={alert.severity} sx={{ mb: 0.5, textAlign: 'left' }}
                                          onClose={() => deleteAlert(alert)}>
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
