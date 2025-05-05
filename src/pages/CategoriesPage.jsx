import { Alert, Button, message, Modal, Space, Spin, Table, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDeleteCategoryMutation, useGetCategoriesQuery } from '../store/services/categoryApi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const { Title } = Typography;

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { data, error, isLoading } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  const showModal = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleOk = async () => {
    if (selectedId != null) {
      try {
        await deleteCategory(selectedId).unwrap();
        message.success('Category deleted successfully');
      } catch (err) {
        const detail = err?.data?.errors?.[0]?.detail;
        message.error(detail || 'Failed to delete category');
      }
      setOpen(false);
      setSelectedId(null);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  if (isLoading) return <Spin />;
  if (error) return <Alert message="Failed to load categories" type="error" showIcon />;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 1600,
      render: (text, record) => (
        <a onClick={() => navigate(`/manage-categories/${record.id}`)}>{text}</a>
      ),
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={1} style={{ margin: 0 }}>Categories</Title>
        <Button
          type="primary"
          size="large"
          onClick={() => navigate('/manage-categories/create')}>
          + Add Category
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
        <p>Are you sure you want to delete this category? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default CategoriesPage;