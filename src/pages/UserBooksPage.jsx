import { Alert, Button, Input, message, Modal, Select, Space, Spin, Table, Typography, Checkbox, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useGetBooksQuery } from '../store/services/bookApi';
import { useGetCategoriesQuery } from '../store/services/categoryApi';
import { useAddBorrowRequestMutation } from '../store/services/myBorrowRequestApi';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';

const { Title } = Typography;
const { Option } = Select;

const UserBooksPage = () => {
  const navigate = useNavigate();

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [confirmBorrowVisible, setConfirmBorrowVisible] = useState(false);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const { data, error, isLoading, refetch: refetchBooks } = useGetBooksQuery({
    search: debouncedSearch,
    categoryId,
    sort: sortOrder
  });

  const { data: categories } = useGetCategoriesQuery();
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
      await refetchBooks(); // force re-fetch books with updated quantity
      message.success('Borrow request submitted');
      setIsSelecting(false);
      setSelectedBooks([]);
      setConfirmBorrowVisible(false);
    } catch (err) {
      const detail = err?.data?.errors?.[0]?.detail;
      message.error(detail || 'Failed to submit borrow request');
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debouncedChange(e.target.value);
  };

  const debouncedChange = debounce((value) => {
    setDebouncedSearch(value);
  }, 400);

  useEffect(() => {
    return () => {
      debouncedChange.cancel();
    };
  }, []);

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
      <div className="flex justify-between items-center mb-4">
        <Title level={1} className="!mb-0">Books</Title>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search title..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={handleSearchChange}
            allowClear
          />
          <Select
            placeholder="Filter by category"
            allowClear
            value={categoryId}
            onChange={setCategoryId}
          >
            {categories?.map(c => (
              <Option key={c.id} value={c.id}>{c.name}</Option>
            ))}
          </Select>
          <Select
            placeholder="Sort title"
            className="w-[230px]"
            allowClear
            value={sortOrder}
            onChange={setSortOrder}
          >
            <Option value="asc">Title A → Z</Option>
            <Option value="desc">Title Z → A</Option>
          </Select>
          <Button
            type="primary"
            size="large"
            onClick={toggleSelectionMode}
          >
            {isSelecting ? 'Cancel Selection' : 'Select Book to Borrow'}
          </Button>
        </div>
      </div>

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
          You are about to request to borrow <strong>{selectedBooks.length}</strong> book
          {selectedBooks.length > 1 ? 's' : ''}.
          This will count against your 3 requests per month.
        </p>
      </Modal>

      {isSelecting && selectedBooks.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
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