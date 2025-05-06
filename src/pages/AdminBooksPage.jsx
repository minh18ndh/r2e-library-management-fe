import { Alert, Button, Input, message, Modal, Select, Space, Spin, Table, Typography, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useDeleteBookMutation, useGetBooksQuery } from '../store/services/bookApi';
import { useGetCategoriesQuery } from '../store/services/categoryApi';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';

const { Title } = Typography;
const { Option } = Select;

const AdminBooksPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const { data: books, error, isLoading } = useGetBooksQuery({
    search: debouncedSearch,
    categoryId,
    sort: sortOrder
  });

  const { data: categories } = useGetCategoriesQuery();
  const [deleteBook] = useDeleteBookMutation();

  const showModal = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleOk = async () => {
    if (selectedId != null) {
      try {
        await deleteBook(selectedId).unwrap();
        message.success('Book deleted successfully');
      } catch (err) {
        const detail = err?.data?.errors?.[0]?.detail;
        message.error(detail || 'Failed to delete book');
      }
      setOpen(false);
      setSelectedId(null);
    }
  };

  const handleCancel = () => setOpen(false);

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
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <a onClick={() => navigate(`/manage-books/${record.id}`)}>{text}</a>
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
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'action',
      render: (id) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/manage-books/${id}`)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => showModal(id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-8">
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
            onClick={() => navigate('/manage-books/create')}
          >
            + Add Book
          </Button>
        </div>
      </div>

      <Table columns={columns} dataSource={books} rowKey="id" />

      <Modal
        open={open}
        title="Confirm Deletion"
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes, delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this book? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default AdminBooksPage;