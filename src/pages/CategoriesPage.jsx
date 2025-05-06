import { Alert, Button, Input, message, Modal, Space, Spin, Table, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useDeleteCategoryMutation, useGetCategoriesQuery } from '../store/services/categoryApi';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';

const { Title } = Typography;

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { data, error, isLoading } = useGetCategoriesQuery({ search: debouncedSearch });
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
  if (error) return <Alert message="Failed to load categories" type="error" showIcon />;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 1200,
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
            onClick={() => navigate(`/manage-categories/${id}`)}
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
        <Title level={1} className="!mb-0">Categories</Title>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search category..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={handleSearchChange}
            allowClear
          />
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/manage-categories/create')}
          >
            + Add Category
          </Button>
        </div>
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