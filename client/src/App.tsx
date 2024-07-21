import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import './App.css';
import LoginPage from "./pages/LoginPage";
import {Texts} from "./pages/texts/Texts";
import {AddText} from "./pages/texts/AddText";
import {createTheme, ThemeProvider} from "@mui/material";
import {TextPage} from "./pages/texts/TextPage";
import {Tests} from "./pages/tests/Tests";
import {TestPageView} from "./pages/tests/TestPageView";
import {TestPass} from "./pages/tests/TestPass";
import {TestResults} from "./pages/tests/TestResultMultiple";
import {appColors} from "./colors/appColors";
import {TestGenHistory} from "./pages/history/TestGenHistory";
import {TestResultSingle} from "./pages/tests/TestResultSingle";
import { UserTestResults } from './pages/tests/UserTestResults';
import SignUp from './pages/SignUp';
import {Files} from "./pages/files/Files";
import QuestionEdit from "./components/tests/questions/QuestionEdit";
import {TestPageEdit} from "./pages/tests/TestPageEdit";

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

    const questions = {
        id: 1,
        questionText: 'Что такое поток (thread) в Java, и какие преимущества многопоточности в сравнении с однопоточными приложениями?',
        answerOptions: [
            { id: 1, optionText: 'Поток - это процесс внутри операционной системы.', isCorrect: false },
            { id: 2, optionText: 'Поток - это класс в Java, предназначенный для синхронизации операций.', isCorrect: true }
        ]
    }

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
                            <Route path="/tests" element={<Tests/>}/>
                            <Route path="/tests/:id" element={<TestPageView/>}/>
                            <Route path="/tests/:id/edit" element={<TestPageEdit/>}/>
                            <Route path="/tests/pass" element={<TestPass/>}/>
                            <Route path="/tests/result" element={<TestResults/>}/>
                            <Route path="/tests/results" element={<UserTestResults/>}/>
                            <Route path="/tests/:testId/results/:id" element={<TestResultSingle/>} />
                            <Route path="/test-gen-history" element={<TestGenHistory/>}/>
                            <Route path="/files" element={<Files/>}/>
                            <Route path="/sandbox" element={<QuestionEdit
                                question={questions}
                                onDelete={() => {} }
                                onQuestionChange={() => {}}

                            />}/>
                            <Route path="*" element={<Navigate to="/sign-in" replace />} />
                        </Routes>
                    </div>
                </Router>
            </ThemeProvider>
    );
}

export default App;
