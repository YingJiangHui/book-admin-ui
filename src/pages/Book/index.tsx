import BookList from '@/pages/Book/BookList';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import React, { memo } from 'react';

type props = {};
export type BookProps = props;
export const Book: React.FC<React.PropsWithChildren<BookProps>> = memo(
  (props) => {
    const { selectedLibrary } = useModel('currentLibrary');
    return (
      <PageContainer title={'图书馆藏书'}>
        <BookList libraryId={selectedLibrary?.id} />
      </PageContainer>
    );
  },
);
Book.displayName = '';

export default Book;
