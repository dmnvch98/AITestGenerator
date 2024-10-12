import { TestResult } from '../store/tests/passTestStore';
import axiosInstance from '../interceptors/axiosInstance';
import { AxiosError } from 'axios';

class TestResultService {
  saveTestResult = async (dto: TestResult, testId: number) => {
    try {
      const response = await axiosInstance.post(`/api/v1/tests/${testId}/result`, dto);
      return response.data;
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.log(error.message);
    }
  };

  getSingleTestResult = async (testId: number, resultId: number) => {
    try {
      const response =
          await axiosInstance.get(`/api/v1/tests/${testId}/result/${resultId}`);
      return response.data;
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.log(error.message);
    }
  };

  getAllUserTestResults = async () => {
    try {
      const response =
          await axiosInstance.get(`/api/v1/tests/results`);
      return response.data;
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.log(error.message);
    }
  };
}

export default new TestResultService();
