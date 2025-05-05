import { Alert, Button, message, Modal, Spin, Table, Typography, Checkbox, Tag } from 'antd';
import { useGetBooksQuery } from '../store/services/bookApi';
import { useAddBorrowRequestMutation } from '../store/services/myBorrowRequestApi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const { Title } = Typography;

const UserBooksPage = () => {
  const navigate = useNavigate();

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [confirmBorrowVisible, setConfirmBorrowVisible] = useState(false);

  const { data, error, isLoading } = useGetBooksQuery({});
  const [addBorrowRequest, { isLoading: isSubmitting }] = useAddBorrowRequestMutation();

  const toggleSelectionMode = () => {
    setIsSelecting(!isSelecting);
    setSelectedBooks([]);
  };

  const handleCheckboxChange = (bookId, checked) => {
    if (checked) {
      if (selectedBooks.length < 5) {
        setSelectedBooks([...selectedBooks, bookId]);
      } else {
        message.warning("You can only select up to 5 books.");
      }
    } else {
      setSelectedBooks(selectedBooks.filter(id => id !== bookId));
    }
  };

  const handleRequestBorrow = async () => {
    try {
      await addBorrowRequest(selectedBooks).unwrap();
      message.success('Borrow request submitted');
      setIsSelecting(false);
      setSelectedBooks([]);
      setConfirmBorrowVisible(false);
    } catch (err) {
      const detail = err?.data?.errors?.[0]?.detail;
      message.error(detail || 'Failed to submit borrow request');
    }
  };

  if (isLoading) return <Spin />;
  if (error) return <Alert message="Failed to load books" type="error" showIcon />;

  const columns = [
    ...(isSelecting ? [{
      title: '',
      dataIndex: 'id',
      key: 'checkbox',
      render: (_, record) => (
        record.quantity > 0 ? (
          <Checkbox
          // disabled={!selectedBooks.includes(id) && selectedBooks.length >= 5}
            checked={selectedBooks.includes(record.id)}
            onChange={(e) => handleCheckboxChange(record.id, e.target.checked)}
          />
        ) : null
      )
    }] : []),
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <a onClick={() => navigate(`/books/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'category',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => (
        <Tag color={quantity === 0 ? 'red' : 'green'}>{quantity}</Tag>
      )
    },
  ];

  return (
    <div className="min-h-screen p-8 relative">
      <Title level={1}>Books</Title>

      <Button type="primary" style={{ marginBottom: '16px' }} onClick={toggleSelectionMode}>
        {isSelecting ? 'Cancel Selection' : 'Select Book to Borrow'}
      </Button>

      <Table columns={columns} dataSource={data} rowKey="id" />

      <Modal
        open={confirmBorrowVisible}
        title="Confirm Borrow Request"
        onOk={handleRequestBorrow}
        onCancel={() => setConfirmBorrowVisible(false)}
        okText="Yes, submit"
        cancelText="Cancel"
      >
        <p>
          You are about to request to borrow <strong>{selectedBooks.length}</strong> book{selectedBooks.length > 1 ? 's' : ''}.
          This will count against your 3 requests per month.
        </p>
      </Modal>

      {isSelecting && selectedBooks.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <Button
            type="primary"
            size="large"
            loading={isSubmitting}
            onClick={() => setConfirmBorrowVisible(true)}
          >
            Request to Borrow ({selectedBooks.length})
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserBooksPage;