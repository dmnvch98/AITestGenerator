import { TestResult } from '../store/tests/passTestStore';
import {getAxiosInstance} from '../interceptors/getAxiosInstance';
import { AxiosError } from 'axios';

class TestResultService {

  private readonly axiosInstance;

  constructor() {
    this.axiosInstance = getAxiosInstance();
  }

  saveTestResult = async (dto: TestResult, testId: number) => {
    try {
      const response = await this.axiosInstance.post(`/api/v1/tests/${testId}/result`, dto);
      return response.data;
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.log(error.message);
    }
  };

  getSingleTestResult = async (testId: number, resultId: number) => {
    try {
      const response =
          await this.axiosInstance.get(`/api/v1/tests/${testId}/result/${resultId}`);
      return response.data;
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.log(error.message);
    }
  };

  getAllUserTestResults = async () => {
    try {
      const response =
          await this.axiosInstance.get(`/api/v1/tests/results`);
      return response.data;
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.log(error.message);
    }
  };
}

export default new TestResultService();
