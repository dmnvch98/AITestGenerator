import {AxiosError} from "axios";
import customAxios from "../interceptors/custom_axios";
import {Chapter} from "../zustand/chapterStore";

class ChapterService {
    getAllUserChapters = async () => {
        try {
            const response = await customAxios.get("http://localhost:8080/api/v1/chapters");
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    getUserChaptersByIdsIn = async (ids: number[]) => {
        try {
            const response = await customAxios.get("http://localhost:8080/api/v1/chapters", {
                params: { ids: ids.join(',') }
            });            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    saveChapter = async (chapter: Chapter) => {
        try {
            const response = await customAxios.post("http://localhost:8080/api/v1/chapters", chapter);
            return response.status == 201;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    deleteChapter = async (id: number) => {
        try {
            const response = await customAxios.delete("http://localhost:8080/api/v1/chapters/" + id);
            return response.status == 204;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    deleteInBatch = async (ids: number[]) => {
        try {
            const response = await customAxios.patch("http://localhost:8080/api/v1/chapters/", ids);
            return response.status == 204;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    updateChapter = async (chapter: Chapter) => {
        try {
            const response = await customAxios.put("http://localhost:8080/api/v1/chapters/", chapter);
            return response.status == 200;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }
}

export default new ChapterService();