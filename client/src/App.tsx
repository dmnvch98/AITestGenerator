import React, {useEffect} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes, useLocation} from 'react-router-dom';
import './App.css';
import LoginPage from "./pages/auth/LoginPage";
import {createTheme, ThemeProvider} from "@mui/material";
import {TestPageView} from "./pages/tests/view/TestPageView";
import {appColors} from "./styles/appColors";
import {TestResultSingle} from "./pages/tests/TestResultSingle";
import SignUp from './pages/auth/SignUp';
import {Files} from "./pages/files/Files";
import {TestPageEdit} from "./pages/tests/edit/TestPageEdit";
import {TestsPage} from "./pages/tests/TestPage";
import {TestGenerationHistory} from "./pages/history/TestGenerationHistory";
import {PrintTestPage} from "./pages/tests/print/PrintTestPage";
import {TestPageCreate} from "./pages/tests/create/TestPageCreate";
import useAuthStore from "./pages/auth/authStore";
import ServerErrorPage from "./pages/errors/ServerErrorPage";
import {useUserStore} from "./store/userStore";

const MainRoutes = () => {
    const {getTestGenCurrentActivities} = useUserStore();
    const {authenticated} = useAuthStore();
    const location = useLocation();

    const noActivitiesPaths = [
        '/sign-in',
        '/500'
    ]

    useEffect(() => {
        if (authenticated && !noActivitiesPaths.includes(location.pathname)) {
            getTestGenCurrentActivities();
        }
    }, [location.pathname]);

    return (
        <>
            <div className="App">
                {authenticated
                    ? <Routes>
                        <Route path="/sign-in" element={<LoginPage/>}/>
                        <Route path="/tests" element={<TestsPage/>}/>
                        <Route path="/tests/create" element={<TestPageCreate/>}/>
                        <Route path="/tests/:id" element={<TestPageView/>}/>
                        <Route path="/tests/:id/edit" element={<TestPageEdit/>}/>
                        <Route path="/tests/:id/print" element={<PrintTestPage/>}/>
                        <Route path="/tests/:testId/results/:id" element={<TestResultSingle/>}/>
                        <Route path="/test-gen-history" element={<TestGenerationHistory/>}/>
                        <Route path="/files" element={<Files/>}/>
                        <Route path="/500" element={<ServerErrorPage/>}/>
                        <Route path="*" element={<Navigate to="/sign-in" replace/>}/>
                    </Routes>
                    : (
                        <Routes>
                            <Route path="/sign-in" element={<LoginPage/>}/>
                            <Route path="/sign-up" element={<SignUp/>}/>
                            <Route path="/500" element={<ServerErrorPage/>}/>
                            <Route path="*" element={<Navigate to="/sign-in" replace/>}/>
                        </Routes>
                    )
                }
            </div>
        </>
    )
}

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

    return (

        <ThemeProvider theme={theme}>
            <Router>
                <MainRoutes/>
            </Router>
        </ThemeProvider>
    );
}

export default App;
