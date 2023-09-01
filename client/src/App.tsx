import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import LoginPage from "./pages/LoginPage";
import {Chapters} from "./pages/Chapters";
import {AddChapter} from "./pages/AddChapter";
import {ChapterPage} from "./pages/ChapterPage";
import {createTheme, ThemeProvider} from "@mui/material";

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
                        <Route path="/chapters" element={<Chapters/>}/>
                        <Route path="/" element={<LoginPage/>}/>
                        <Route path="/add-chapter" element={<AddChapter/>}/>
                        <Route path="/chapters/:id" element={<ChapterPage/>}/>
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
