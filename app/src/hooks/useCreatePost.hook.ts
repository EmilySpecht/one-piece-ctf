import { useAxiosWithAuth } from "./useAxiosWithAuth.hook";

export type CreatePostParams = {
  text: string;
  postFile?: File;
  user: string;
};

export const useCreatePost = () => {
  const axios = useAxiosWithAuth();

  const createPost = async ({ text, postFile, user }: CreatePostParams) => {
    const formData = new FormData();
    formData.append("text", text);
    formData.append("user", user);

    if (postFile) {
      formData.append("postFile", postFile, postFile.name);
    }

    const response = await axios.post("/create-post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  };

  return {
    createPost,
  };
};
