import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import LoginPage from "./pages/LoginPage";
import {Texts} from "./pages/texts/Texts";
import {AddText} from "./pages/texts/AddText";
import {createTheme, ThemeProvider} from "@mui/material";
import {TextPage} from "./pages/texts/TextPage";
import {Tests} from "./pages/tests/Tests";
import {TestPageView} from "./pages/tests/TestPageView";
import {TestPass} from "./pages/tests/TestPass";
import {TestResults} from "./pages/tests/TestResult";
import {appColors} from "./colors/appColors";
import {GenerateTestAskGroup} from "./components/tests/GenerateTestAskGroup";

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
                <div className="App">
                    <Routes>
                        <Route path="/texts" element={<Texts/>}/>
                        <Route path="/sign-in" element={<LoginPage/>}/>
                        <Route path="/add-text" element={<AddText/>}/>
                        <Route path="/texts/:id" element={<TextPage/>}/>
                        <Route path="/tests" element={<Tests/>}/>
                        <Route path="/tests/:id" element={<TestPageView/>}/>
                        <Route path="/tests/pass" element={<TestPass/>}/>
                        <Route path="/tests/result" element={<TestResults/>}/>
                        <Route path="/tests/generate" element={<GenerateTestAskGroup/>}/>
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
