import { useTextStore } from '../../store/textStore';
import { Alert, Box, Snackbar } from '@mui/material';
import { useEffect } from 'react';
import { LoggedInUserPage } from '../../components/main/LoggedInUserPage';
import { TextTable } from '../../components/texts/TextTable';
import Typography from '@mui/material/Typography';
import { useTestStore } from '../../store/tests/testStore';


const ChaptersContent = () => {

  const {
    textSavedFlag, textDeletedFlag,
    toggleTextSavedFlag, toggleTextDeletedFlag,
    getTexts
  } = useTextStore();

  const {testGenerationStarted, setTestGenerationStarted} = useTestStore();

  useEffect(() => {
    getTexts();
  }, []);

  return (
      <>
        <Typography variant="h5" align="left" sx={{ mb: 2 }}>
          Пользовательские тексты
        </Typography>

        <Box>
          <TextTable />
        </Box>

        <Snackbar
            open={textSavedFlag}
            autoHideDuration={3000}
            onClose={toggleTextSavedFlag}
        >
          <Alert severity="success">
            Текст успешно сохранен
          </Alert>
        </Snackbar>

        <Snackbar
            open={textDeletedFlag}
            autoHideDuration={3000}
            onClose={toggleTextDeletedFlag}
        >
          <Alert severity="success">
            Текст успешно удален
          </Alert>
        </Snackbar>

        <Snackbar
            open={testGenerationStarted}
            autoHideDuration={3000}
            onClose={() => {setTestGenerationStarted(!testGenerationStarted)}}
        >
          <Alert severity="success">
            Генерация теста начата
          </Alert>
        </Snackbar>
      </>
  );
};

export const Texts = () => {
  return <LoggedInUserPage mainContent={<ChaptersContent />} />;
};
