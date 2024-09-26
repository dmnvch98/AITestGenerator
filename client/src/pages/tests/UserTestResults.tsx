import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect } from 'react';
import { TestResult, usePassTestStore } from '../../store/tests/passTestStore';
import DateTimeUtils from '../../utils/DateTimeUtils';
import { useNavigate } from 'react-router-dom';

export const UserTestResults = () => {

  const { testResults, getAllUserTestResults } = usePassTestStore();
  const navigate = useNavigate();

  useEffect(() => {
    getAllUserTestResults();
  }, []);

  const calcCorrect = (testResult: TestResult): number => {
    return testResult.questionAnswers.map(tr => tr.passed).filter(tr => tr).length;
  };

  return (
      <>
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

