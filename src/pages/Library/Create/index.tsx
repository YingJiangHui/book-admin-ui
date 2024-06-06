import { CustomAMap } from '@/components/CustomAMap';
import { postCreateLibrary } from '@/services/library';
import { useNavigate } from '@@/exports';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { message } from 'antd';

console.log(window.AMap.Map, 'mpa2');
export default () => {
  const navigate = useNavigate();
  return (
    <PageContainer
      // style={{ background: '#fff' }}
      header={{ title: '创建图书馆' }}
      // content="请搜索并指定图书馆定位"
    >
      <ProCard>
        <CustomAMap
          onFinish={async (values) => {
            const res = await postCreateLibrary({
              ...values,
            });
            message.success('添加成功');
            navigate(`/library/detail/${res.data.id}`, { replace: true });
            return Promise.resolve(true);
          }}
        ></CustomAMap>
        ;
      </ProCard>
    </PageContainer>
  );
};
