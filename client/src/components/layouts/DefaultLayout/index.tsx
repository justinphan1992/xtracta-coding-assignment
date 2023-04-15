import { Layout } from 'antd';
import styles from './index.module.css'
const { Header, Content } = Layout;

export type DefaultLayoutProps = {
  children: React.ReactNode;
};

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div className="default-layout">
      <Header className={styles.header}>OCR App</Header>
      <Content className={styles.content}>{children}</Content>
    </div>
  );
};

export default DefaultLayout;
