import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { request, useModel } from '@umijs/max';
import styles from './index.less';
import { useRequest } from '@@/plugin-request';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  useRequest(()=>{
    request
  })
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name={trim(name)} />
      </div>
    </PageContainer>
  );
};

export default HomePage;
