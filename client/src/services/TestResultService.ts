import { TestResult } from '../store/tests/passTestStore';
import customAxios from '../interceptors/custom_axios';
import { AxiosError } from 'axios';

class TestResultService {
  saveTestResult = async (dto: TestResult, testId: number) => {
    try {
      const response = await customAxios.post(`http://localhost:8080/api/v1/tests/${testId}/result`, dto);
      return response.data;
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.log(error.message);
    }
  };

  getSingleTestResult = async (testId: number, resultId: number) => {
    try {
      const response =
          await customAxios.get(`http://localhost:8080/api/v1/tests/${testId}/result/${resultId}`);
      return response.data;
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.log(error.message);
    }
  };

  getAllUserTestResults = async () => {
    try {
      const response =
          await customAxios.get(`http://localhost:8080/api/v1/tests/results`);
      return response.data;
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.log(error.message);
    }
  };
}

export default new TestResultService();
