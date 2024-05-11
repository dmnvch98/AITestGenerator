import { LoggedInUserPage } from '../../components/main/LoggedInUserPage';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect } from 'react';
import { TestResult, usePassTestStore } from '../../store/tests/passTestStore';
import DateTimeUtils from '../../utils/DateTimeUtils';
import { useNavigate } from 'react-router-dom';

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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Test title</TableCell>
                <TableCell>Date passed</TableCell>
                <TableCell>Questions</TableCell>
                <TableCell>Correct</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testResults.map((tr, index) => (
                  <TableRow key={index}>
                    <TableCell>{tr.testTitle}</TableCell>
                    <TableCell>{DateTimeUtils.formatDate(tr.testPassedTime)}</TableCell>
                    <TableCell>{tr.questionAnswers.length}</TableCell>
                    <TableCell>{calcCorrect(tr)}</TableCell>
                    <TableCell>
                      <Button
                          onClick={() => {
                            navigate(`/tests/1/results/${tr.id}`);
                          }}
                          variant="outlined"
                          color="primary"
                      >
                        View Result
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
