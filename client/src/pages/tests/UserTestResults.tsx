import { LoggedInUserPage } from '../../components/main/LoggedInUserPage';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect } from 'react';
import { TestResult, usePassTestStore } from '../../store/tests/passTestStore';
import DateTimeUtils from '../../utils/DateTimeUtils';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';

const UserTestResultsContent = () => {

  const { testResults, getAllUserTestResults } = usePassTestStore();
  const navigate = useNavigate();

  useEffect(() => {
    getAllUserTestResults();
    console.log(testResults);
  }, []);

  const calcCorrect = (testResult: TestResult): number => {
    return testResult.questionAnswers.map(tr => tr.passed).filter(tr => tr).length;
  };

  return (
      <>
        <Typography variant="h5" align="left" sx={{ mb: 2 }}>
          История прохождения тестов
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Заголовок теста</TableCell>
                <TableCell>Дата прохождение</TableCell>
                <TableCell>Кол-во вопросов</TableCell>
                <TableCell>Кол-во правильных</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testResults.map((tr, index) => (
                  <TableRow key={index}>
                    <TableCell>{tr.testTitle}</TableCell>
                    <TableCell>{DateTimeUtils.formatDateTime(tr.testPassedTime)}</TableCell>
                    <TableCell>{tr.questionAnswers.length}</TableCell>
                    <TableCell>{calcCorrect(tr)}</TableCell>
                    <TableCell>
                      <Button
                          onClick={() => {
                            navigate(`/tests/${tr.testId}/results/${tr.id}`);
                          }}
                          variant="outlined"
                          color="primary"
                      >
                        Просмотр
                      </Button>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
  );
};

export const UserTestResults = () => {
  return <LoggedInUserPage mainContent={<UserTestResultsContent />} />;
};
