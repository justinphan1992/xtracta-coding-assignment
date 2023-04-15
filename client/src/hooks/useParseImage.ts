import { useMutation } from '@tanstack/react-query';

import { Word } from '../types';

export type ParseImageResponse = {
  success: boolean;
  words?: Word[];
  message?: string;
};

export type ParseImageError = {
  statusCode: number;
  message: string;
};

export type ParseImageRequest = {
  file: File;
};

export const useParseImage = () => {
  return useMutation<ParseImageResponse, ParseImageError, ParseImageRequest>(
    (data: ParseImageRequest) => {
      const formData = new FormData();
      formData.append('file', data.file);

      return fetch(`${import.meta.env.VITE_API_URL}/ocr/image`, {
        method: 'POST',
        body: formData,
      }).then((response) => response.json());
    },
  );
};
