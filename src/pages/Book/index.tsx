import BookList from '@/pages/Book/BookList';
import { useModel } from '@umijs/max';
import React, { memo } from 'react';

type props = {};
export type BookProps = props;
export const Book: React.FC<React.PropsWithChildren<BookProps>> = memo(
  (props) => {
    const { selectedLibrary } = useModel('currentLibrary');
    return (
      <>
        <BookList libraryId={selectedLibrary.id} />
      </>
    );
  },
);
Book.displayName = '';

export default Book;
