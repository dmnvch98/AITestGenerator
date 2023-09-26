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

function App() {
    const theme = createTheme({
        typography: {
            fontFamily: [
                'Montserrat',
            ].join(','),
        },
        palette: {
            primary: {
                main: '#a3ccbe',
                light: '#a3ccbe',
                dark: '#44734b',
            },
            secondary: {
                main: '#f50057',
            },
            error: {
                main: '#e57373'
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
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
