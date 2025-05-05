import { Alert, Button, message, Modal, Space, Spin, Table, Typography, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDeleteBookMutation, useGetBooksQuery } from '../store/services/bookApi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const { Title } = Typography;

const AdminBooksPage = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { data, error, isLoading } = useGetBooksQuery({});
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

  const handleCancel = () => {
    setOpen(false);
  };

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
        <Button
          type="primary"
          size="large"
          onClick={() => navigate('/manage-books/create')}
        >
          + Add Book
        </Button>
      </div>

      <Table columns={columns} dataSource={data} rowKey="id" />

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