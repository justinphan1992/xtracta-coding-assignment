import { InboxOutlined } from '@ant-design/icons';
import { message, UploadProps } from 'antd';
import { Upload } from 'antd';

import styles from './index.module.css';

const { Dragger } = Upload;

const defaultProps: UploadProps = {
  name: 'file',
  accept: 'image/*',
  showUploadList: false,
  beforeUpload(file) {
    const MAX_SIZE = 1024 * 1024; // 1MB
    if (file.size > MAX_SIZE) {
      message.error('Image must be smaller than 1MB!');
      return false;
    }

    if (!/\.*(jpe?g|png|bmp|webp)$/i.test(file.type)) {
      message.error(
        'You can only upload image with following extensions: JPG, JPEG, PNG, BMP, WEBP!',
      );
      return false;
    }
  },
};

export type FormUploadProps = {
  action: UploadProps['action'];
  disabled: boolean;
};

const FormUpload = (props: FormUploadProps) => (
  <Dragger {...defaultProps} {...props} className={styles.upload}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag image to this area to upload</p>
  </Dragger>
);

export default FormUpload;
