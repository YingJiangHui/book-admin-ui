/*Book 列表界面*/
import React, { memo } from 'react';

type props = {};
export type BookListProps = props;
export const BookList: React.FC<React.PropsWithChildren<BookListProps>> = memo(
  (props) => {
    return <>图书列表界面</>;
  },
);
BookList.displayName = '图书列表界面';
export default BookList;
