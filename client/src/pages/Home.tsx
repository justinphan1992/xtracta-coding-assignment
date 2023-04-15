import { LoadingOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useState } from 'react';

import DefaultLayout from '../components/layouts/DefaultLayout';
import FormUpload from '../components/molecules/FormUpload';
import PreviewImage from '../components/molecules/PreviewImage';
import { useParseImage } from '../hooks/useParseImage';

function Home() {
  const [currentImage, setCurrentImage] = useState<File>();
  const { mutateAsync, isLoading, data, isSuccess } = useParseImage();

  const handleUpload = async (file: RcFile) => {
    setCurrentImage(undefined);
    const response = await mutateAsync({ file });
    if (response.message) {
      message.error(response.message);
      return 'failed';
    }
    setCurrentImage(file);
    return 'ok';
  };

  return (
    <DefaultLayout>
      <FormUpload action={handleUpload} disabled={isLoading} />
      {isLoading && <LoadingOutlined />}
      {isSuccess && <PreviewImage originImage={currentImage} words={data?.words || []} />}
    </DefaultLayout>
  );
}

export default Home;
