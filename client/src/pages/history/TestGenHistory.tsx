import {TestGenHistoryTable} from "../../components/history/TestGenHistoryTable";
import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";

const TestGenHistoryContent = () => {
    return(
        <>
            <TestGenHistoryTable/>
        </>
    )
}

export const TestGenHistory = () => {
    return <LoggedInUserPage mainContent={<TestGenHistoryContent/>}/>
}