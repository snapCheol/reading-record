import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Edit from '../components/Edit';
import { logout as logoutSaga } from '../redux/modules/auth';
import { editBook as editBookSaga } from '../redux/modules/books';
import { useParams } from 'react-router-dom';
import { RootState } from '../redux/modules/rootReducer';
import { BookReqType } from '../types';
import { getBooks as getBooksSaga } from '../redux/modules/books';

const EditContainer = () => {
  const { books, loading } = useSelector((state: RootState) => state.books);
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);
  const bookPerId: any = useParams();
  const bookIdNumber = parseInt(bookPerId.id, 10);
  const book = books.filter((book) => book.bookId === bookIdNumber)[0];
  const edit = useCallback(
    (
      bookId: number | undefined,
      { title, message, author, url }: BookReqType,
    ) => {
      dispatch(editBookSaga(bookId, { title, message, author, url }));
    },
    [dispatch],
  );

  useEffect(() => {
    if (!book) {
      dispatch(getBooksSaga());
    }
  }, [dispatch, book]);
  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.
  // [project] Edit 나 Detail 컴포넌트에서 새로고침 시, 리스트가 없는 경우, 리스트를 받아오도록 처리했다.
  if (loading || !book) return null;
  return <Edit book={book} loading={false} logout={logout} edit={edit} />;
};

export default EditContainer;
