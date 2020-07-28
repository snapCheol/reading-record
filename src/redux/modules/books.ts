import { BookResType, BookReqType } from '../../types';
import { createActions, handleActions } from 'redux-actions';
import { put, select, call, takeEvery } from 'redux-saga/effects';
import { getTokenFromState } from '../utils';
import BookService from '../../services/BookService';
import { push } from 'connected-react-router';

export interface BooksState {
  books: BookResType[];
  loading: boolean;
  error: Error | null;
}

const initialState: BooksState = {
  books: [],
  loading: false,
  error: null,
};

const options = {
  prefix: 'my-books/books',
};
export const { success, pending, fail } = createActions(
  {
    SUCCESS: (books: BookResType[]) => ({ books }),
  },
  'PENDING',
  'FAIL',
  options,
);
export const { addBook, deleteBook, editBook, getBooks } = createActions(
  {
    ADD_BOOK: (book: BookReqType) => ({ book }),
    DELETE_BOOK: (bookId: number) => ({ bookId }),
    EDIT_BOOK: (book: BookReqType, bookId: number) => ({ book, bookId }),
  },
  'GET_BOOKS',
  options,
);
// [project] redux-action 을 이용하여, books 모듈의 액션 생성 함수와 리듀서를 작성했다.

const reducer = handleActions<BooksState, any>(
  {
    PENDING: (state) => ({
      ...state,
      loading: true,
      error: null,
      books: [],
    }),
    ADD_BOOK: (state, action) => ({
      ...state,
      books: state.books.concat(action.payload.book),
      error: null,
      loading: false,
    }),
    SUCCESS: (state, action) => ({
      ...state,
      books: action.payload.books,
      loading: false,
      error: null,
    }),
    FAIL: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
  },
  initialState,
  options,
);

export default reducer;

// [project] 책 목록을 가져오는 saga 함수를 작성했다.
function* getBooksListSaga() {
  try {
    yield put(pending());
    const token: string = yield select(getTokenFromState);
    const books = yield call(BookService.getBooks, token);
    yield put(success(books));
  } catch (error) {
    yield put(fail(new Error(error?.response?.data?.error || 'UNKNOWN_ERROR')));
  }
}
// [project] 책을 추가하는 saga 함수를 작성했다.
function* addBookSaga(action: any) {
  try {
    const token: string = yield select(getTokenFromState);
    yield call(BookService.addBook, token, action.payload.book);
    yield put(pending());
    const books = yield call(BookService.getBooks, token);
    yield put(success(books));
    yield put(push('/'));
  } catch (error) {
    yield put(fail(new Error(error?.response?.data?.error || 'UNKNOWN_ERROR')));
  }
}
// [project] 책을 삭제하는 saga 함수를 작성했다.
// [project] 책을 수정하는 saga 함수를 작성했다.

// [project] saga 함수를 실행하는 액션과 액션 생성 함수를 작성했다.

export function* sagas() {
  yield takeEvery(`${options.prefix}/GET_BOOKS`, getBooksListSaga);
  yield takeEvery(`${options.prefix}/ADD_BOOK`, addBookSaga);
}
