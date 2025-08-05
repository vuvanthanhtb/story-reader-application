import { useEffect } from 'react';
import styles from './layout.module.scss';

type IProps = {
  children: React.ReactNode;
  title: string;
};

const PrivateLayout = (props: IProps) => {
  const { children, title = 'Story Reader Application' } = props;

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className={styles['layout-container']}>
      <div className={styles['layout-container__left']}>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default PrivateLayout;
