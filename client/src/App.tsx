import React, {useEffect} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import './App.css';
import LoginPage from "./pages/auth/LoginPage";
import {Texts} from "./pages/texts/Texts";
import {AddText} from "./pages/texts/AddText";
import {createTheme, ThemeProvider} from "@mui/material";
import {TextPage} from "./pages/texts/TextPage";
import {TestPageView} from "./pages/tests/view/TestPageView";
import {TestPass} from "./pages/tests/TestPass";
import {TestResults} from "./pages/tests/TestResultMultiple";
import {appColors} from "./styles/appColors";
import {TestResultSingle} from "./pages/tests/TestResultSingle";
import {UserTestResults} from './pages/tests/UserTestResults';
import SignUp from './pages/auth/SignUp';
import {Files} from "./pages/files/Files";
import {TestPageEdit} from "./pages/tests/edit/TestPageEdit";
import {TestsPage} from "./pages/tests/TestPage";
import {TestGenerationHistory} from "./pages/history/TestGenerationHistory";
import {PrintTestPage} from "./pages/tests/print/PrintTestPage";
import {TestPageCreate} from "./pages/tests/create/TestPageCreate";
import {useUserStore} from "./store/userStore";
import {useAuthStore} from "./pages/auth/authStore";

function App() {
    const theme = createTheme({
        typography: {
            fontFamily: [
                'Montserrat',
            ].join(','),
        },
        palette: {
            primary: {
                main: appColors.primary.main,
                light: appColors.primary.light,
                dark: appColors.primary.dark,
            },
            secondary: {
                main: appColors.secondary.main,
            },
            error: {
                main: appColors.error.main
            }
        },
    });

    const { authenticated, checkAuthentication } = useAuthStore();
    const { getTestGenCurrentActivities, getTestGenCurrentActivitiesLongPoll } = useUserStore();

    useEffect(() => {
        if (authenticated) {
            getTestGenCurrentActivities();
            getTestGenCurrentActivitiesLongPoll();
        } else {
            checkAuthentication();
        }
    }, [authenticated]);

    return (

        <ThemeProvider theme={theme}>
            <Router>
                    <div className="App">
                        <Routes>
                            <Route path="/texts" element={<Texts/>}/>
                            <Route path="/sign-in" element={<LoginPage/>}/>
                            <Route path="/sign-up" element={<SignUp/>}/>
                            <Route path="/add-text" element={<AddText/>}/>
                            <Route path="/texts/:id" element={<TextPage/>}/>
                            <Route path="/tests" element={<TestsPage/>}/>
                            <Route path="/tests/create" element={<TestPageCreate/>}/>
                            <Route path="/tests/:id" element={<TestPageView/>}/>
                            <Route path="/tests/:id/edit" element={<TestPageEdit/>}/>
                            <Route path="/tests/:id/print" element={<PrintTestPage/>}/>
                            <Route path="/tests/pass" element={<TestPass/>}/>
                            <Route path="/tests/result" element={<TestResults/>}/>
                            <Route path="/tests/results" element={<UserTestResults/>}/>
                            <Route path="/tests/:testId/results/:id" element={<TestResultSingle/>}/>
                            <Route path="/test-gen-history" element={<TestGenerationHistory/>}/>
                            <Route path="/files" element={<Files/>}/>
                            <Route path="*" element={<Navigate to="/sign-in" replace/>}/>
                        </Routes>
                    </div>
                    )
            </Router>
        </ThemeProvider>
    );
}

export default App;
