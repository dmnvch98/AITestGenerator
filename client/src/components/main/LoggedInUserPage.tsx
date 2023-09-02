import { SidebarHeader } from "./SidebarHeader";
import {Container} from "@mui/material";

export const LoggedInUserPage = ({ mainContent }: any) => {
    return (
        <>
           <SidebarHeader>
               <Container>
                   {mainContent}
               </Container>
           </SidebarHeader>
        </>
    );
};
