import { CustomAMap } from '@/components/CustomAMap';
import { PageContainer, ProCard } from '@ant-design/pro-components';

console.log(window.AMap.Map, 'mpa2');
export default () => {
  return (
    <PageContainer
      // style={{ background: '#fff' }}
      header={{ title: '创建图书馆' }}
      // content="请搜索并指定图书馆定位"
    >
      <ProCard>
        <CustomAMap></CustomAMap>;
      </ProCard>
    </PageContainer>
  );
};
