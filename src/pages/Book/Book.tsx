/*Book 列表界面*/
import { BookFormTemplate } from '@/components/FormTemplate/BookTemplate';
import { Constants } from '@/constants';
import {
  createBook,
  deleteBook,
  recoverBook,
  updateBook,
} from '@/services/book';
import { getBooksInLibrary } from '@/services/library';
import { Link } from '@@/exports';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProFormInstance,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Image, Popconfirm, Space, Tag, message } from 'antd';
import React, { memo, useRef } from 'react';

type props = {
  libraryId?: number;
};
export type BookListProps = props;
export const BookList: React.FC<React.PropsWithChildren<BookListProps>> = memo(
  (props) => {
    const { libraryId } = props;
    const actionRef = useRef<ActionType>();
    const formRef = useRef<ProFormInstance>();
    return (
      <ProTable<API.Book.Instance, Parameters<typeof getBooksInLibrary>[0]>
        bordered
        columns={[
          { dataIndex: 'id', title: '编号' },
          //   图书封面
          {
            dataIndex: 'files',
            title: '封面',
            render: (dom, record) => {
              return (
                <Image
                  fallback={Constants.Common.ImageFallback}
                  preview={false}
                  src={record.files?.[0]?.url}
                  alt={record.title + '封面'}
                  style={{ width: 50 }}
                />
              );
            },
          },
          {
            dataIndex: 'title',
            title: '书名',
            ellipsis: true,
            render: (dom, record) => {
              return <Link to={`/library/detail/${record.id}`}>{dom}</Link>;
            },
          },
          {
            dataIndex: 'isbn',
            title: 'ISBN',
          },
          {
            dataIndex: 'author',
            title: '作者',
          },
          {
            dataIndex: 'publisher',
            title: '出版社',
          },
          {
            dataIndex: 'publishedYear',
            title: '出版年份',
          },
          {
            ellipsis: true,
            dataIndex: 'description',
            title: '描述',
          },
          {
            dataIndex: 'available',
            title: '上架状态',
            render: (dom, record) => {
              return record.available ? (
                <Tag bordered={false} color="success">
                  已上架
                </Tag>
              ) : (
                <Tag bordered={false}>已下架</Tag>
              );
            },
          },
          {
            dataIndex: 'action',
            title: '操作',
            render: (_, record) => {
              return (
                <Space>
                  {record.available ? (
                    <Popconfirm
                      title="下架"
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      description="确认是否下架图书"
                      onConfirm={() =>
                        deleteBook({ id: record.id }).then(() => {
                          message.success('操作成功');
                          actionRef.current?.reload();
                        })
                      }
                    >
                      <a>下架</a>
                    </Popconfirm>
                  ) : (
                    <Popconfirm
                      title="上架"
                      description="确认是否上架图书"
                      icon={<QuestionCircleOutlined />}
                      onConfirm={() =>
                        recoverBook({ id: record.id }).then(() => {
                          message.success('操作成功');
                          actionRef.current?.reload();
                        })
                      }
                    >
                      <a>上架</a>
                    </Popconfirm>
                  )}
                  <ModalForm<API.Book.CreateParams>
                    formRef={formRef}
                    modalProps={{ maskClosable: false }}
                    key={'book-form-edit'}
                    onFinish={async (values) => {
                      await updateBook({ ...values, id: record.id });
                      actionRef.current?.reload();
                      message.success('操作成功');
                      formRef.current?.resetFields();
                      return Promise.resolve(true);
                    }}
                    initialValues={{
                      ...record,
                      libraryId: libraryId,
                      file: record?.files?.map((item) => ({ url: item.url })),
                      // isbn: '9787544792745',
                      // title: '一百年，许多人，许多事',
                      // author: '杨苡/口述 / 余斌/撰写',
                      // publisher: '译林出版社',
                      // publishedYear: '2023',
                      // description:
                      //   '“人的一生不知要遇到多少人与事，到了我这个岁数，经历过军阀混战、抗日战争、解放战争，以及新中国成立之后发生的种种，我虽是个平凡的人，却也有许许多多的人可念，许许多多的事想说。”\\n\\n本书是五四运动同龄人、西南联大进步学子、翻译名家、百岁老人杨苡的唯一口述自传。从1919年走向今天，杨苡的人生百年，正是中国栉风沐雨、沧桑巨变的百年。时代与人生的淬炼，凝结为一代知识女性的天真与浪漫之歌。\\n\\n世纪回眸中，相比于传奇与成就，杨苡更看重她的“日子”，及其承载的亲情、友情、爱情和世情：童年深宅里，祖辈的煊赫、北洋政商两界的风云变幻她不大闹得清，念念不忘者，是一个个普通人的境遇；同窗情谊、少女心事、诗歌与话剧，“中西”十年乘着歌声的翅膀，最是无忧无虑；民族危亡之际，自天津、上海、香港到昆明，西迁途中高唱《松花江上》，文明之火光焰不熄；从西南联大到中央大学，记忆里依旧是年轻的身影——初见“文学偶像”巴金，大轰炸后满头灰土的闻一多，手杖点在石板路上嘀嘀笃笃的吴宓，“夸我们是勇敢少女”的恩师沈从文，还有滇水之边的月下谈心，嘉陵江畔的重逢与告别……\\n\\n学者余斌历时十年，用倾听抵抗遗忘，以细节通向历史的真实。家族旧事、翡翠年华、求学之路、山河故人，一个世纪的人与事在叙述中缓缓展开。“我有意无意间充当了杨先生和读者的中间人，它应该是一部可以面向一般读者的口述史。”',
                    }}
                    title={'图书编辑'}
                    trigger={<a>编辑</a>}
                  >
                    <BookFormTemplate />
                  </ModalForm>
                </Space>
              );
            },
          },
        ]}
        actionRef={actionRef}
        cardBordered
        params={{ libraryId: libraryId }}
        request={async (params, sort, filter) => {
          console.log(params, 'p');
          const res = await getBooksInLibrary(params);
          return res.data;
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          defaultValue: {
            option: { fixed: 'right', disable: true },
          },
          onChange(value) {
            console.log('value: ', value);
          },
        }}
        rowKey="id"
        search={false}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                // created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          // pageSize: 5,
          // onChange: (page) => console.log(page),
          showSizeChanger: true,
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <ModalForm<API.Book.CreateParams>
            formRef={formRef}
            modalProps={{ maskClosable: false }}
            key={'book-form'}
            onFinish={async (values) => {
              await createBook(values);
              actionRef.current?.reload();
              message.success('图书新增成功');
              formRef.current?.resetFields();
              return Promise.resolve(true);
            }}
            initialValues={{
              libraryId: libraryId,
              // isbn: '9787544792745',
              // title: '一百年，许多人，许多事',
              // author: '杨苡/口述 / 余斌/撰写',
              // publisher: '译林出版社',
              // publishedYear: '2023',
              // description:
              //   '“人的一生不知要遇到多少人与事，到了我这个岁数，经历过军阀混战、抗日战争、解放战争，以及新中国成立之后发生的种种，我虽是个平凡的人，却也有许许多多的人可念，许许多多的事想说。”\\n\\n本书是五四运动同龄人、西南联大进步学子、翻译名家、百岁老人杨苡的唯一口述自传。从1919年走向今天，杨苡的人生百年，正是中国栉风沐雨、沧桑巨变的百年。时代与人生的淬炼，凝结为一代知识女性的天真与浪漫之歌。\\n\\n世纪回眸中，相比于传奇与成就，杨苡更看重她的“日子”，及其承载的亲情、友情、爱情和世情：童年深宅里，祖辈的煊赫、北洋政商两界的风云变幻她不大闹得清，念念不忘者，是一个个普通人的境遇；同窗情谊、少女心事、诗歌与话剧，“中西”十年乘着歌声的翅膀，最是无忧无虑；民族危亡之际，自天津、上海、香港到昆明，西迁途中高唱《松花江上》，文明之火光焰不熄；从西南联大到中央大学，记忆里依旧是年轻的身影——初见“文学偶像”巴金，大轰炸后满头灰土的闻一多，手杖点在石板路上嘀嘀笃笃的吴宓，“夸我们是勇敢少女”的恩师沈从文，还有滇水之边的月下谈心，嘉陵江畔的重逢与告别……\\n\\n学者余斌历时十年，用倾听抵抗遗忘，以细节通向历史的真实。家族旧事、翡翠年华、求学之路、山河故人，一个世纪的人与事在叙述中缓缓展开。“我有意无意间充当了杨先生和读者的中间人，它应该是一部可以面向一般读者的口述史。”',
            }}
            title={'图书发布'}
            trigger={
              <Button key="button" icon={<PlusOutlined />} type="primary">
                发布图书
              </Button>
            }
          >
            <BookFormTemplate />
          </ModalForm>,
        ]}
      />
    );
  },
);
BookList.displayName = '图书列表界面';
export default BookList;
