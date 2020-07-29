import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import List from '../components/List';
import { logout as logoutSaga } from '../redux/modules/auth';
import { push } from 'connected-react-router';
import {
  getBooks as getBooksSaga,
  deleteBook as deleteBookSaga,
} from '../redux/modules/books';
import { RootState } from '../redux/modules/rootReducer';

const ListContainer: React.FC = () => {
  const { books, loading } = useSelector((state: RootState) => state.books);
  const dispatch = useDispatch();
  const goAdd = useCallback(() => {
    dispatch(push('/add'));
  }, [dispatch]);
  const goEdit = useCallback(
    (bookId: number) => {
      dispatch(push(`/edit/${bookId}`));
    },
    [dispatch],
  );
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);
  const removeBook = useCallback(
    (bookId: number) => {
      let removeConfirm = window.confirm('정말 삭제하시겠습니까?');
      if (removeConfirm) {
        dispatch(deleteBookSaga(bookId));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(getBooksSaga());
  }, [dispatch]);
  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.

  return (
    <List
      books={books}
      loading={loading}
      goAdd={goAdd}
      goEdit={goEdit}
      logout={logout}
      removeBook={removeBook}
    />
  );
};

export default ListContainer;
