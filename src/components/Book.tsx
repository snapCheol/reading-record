import React from 'react';

import styles from './Book.module.css';
import { BookResType } from '../types';
import { Link } from 'react-router-dom';
import { Tooltip, Button } from 'antd';
import { HomeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface BookProps extends BookResType {
  removeBook: (bookId: number) => void;
  goEdit: (bookId: number) => void;
}

// [project] 컨테이너에 작성된 함수를 컴포넌트에서 이용했다.
// [project] BookResType 의 응답 값을 이용하여, Book 컴포넌트를 완성했다.
const Book: React.FC<BookProps> = ({ removeBook, goEdit, ...record }) => {
  const { title, bookId, author, createdAt, url } = record;
  return (
    <div className={styles.book}>
      <h3 className={styles.title}>
        <Link to={`/book/${bookId}`} className={styles.link_detail_title}>
          {title}
        </Link>
      </h3>
      <div className={styles.author}>
        <Link to={`/book/${bookId}`}>{author}</Link>
      </div>
      <div className={styles.created}>{createdAt}</div>
      <div className={styles.tooltips}>
        <Tooltip title={url}>
          <Button
            type="primary"
            href={url}
            target="_blank"
            shape="circle"
            icon={<HomeOutlined />}
            className={styles.link_url}
          ></Button>
        </Tooltip>
        <Tooltip title="수정">
          <Button
            shape="circle"
            icon={<EditOutlined />}
            className={styles.link_url}
            onClick={() => goEdit(bookId)}
          ></Button>
        </Tooltip>
        <Tooltip title="삭제">
          <Button
            // danger property 추가
            type="primary"
            danger
            shape="circle"
            icon={<DeleteOutlined />}
            className={styles.link_url}
            onClick={() => removeBook(bookId)}
          ></Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Book;
