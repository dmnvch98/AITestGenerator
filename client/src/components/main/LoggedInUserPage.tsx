import { SidebarHeader } from "./SidebarHeader";
import {Container} from "@mui/material";

export const LoggedInUserPage = ({ mainContent }: any) => {
    return (
        <>
           <SidebarHeader>
               <Container maxWidth="lg" sx={{mb: 4}}>
                   {mainContent}
               </Container>
           </SidebarHeader>
        </>
    );
};
