import { Table, Typography, Tag, Button, message, Space, Spin, Alert } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useGetAllBorrowRequestsQuery, useUpdateRequestStatusMutation } from '../store/services/manageBorrowRequestApi';

const { Title } = Typography;

const statusMap = {
  0: { label: 'Pending', color: 'yellow' },
  1: { label: 'Approved', color: 'green' },
  2: { label: 'Rejected', color: 'red' },
};

const ManageBorrowRequestsPage = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetAllBorrowRequestsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateRequestStatusMutation();

  const handleUpdate = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      message.success(`Request ${statusMap[status].label.toLowerCase()} successfully`);
    } catch {
      message.error('Failed to update status');
    }
  };

  if (isLoading) return <Spin />;
  if (error) return <Alert message="Failed to load requests" type="error" showIcon />;

  const columns = [
    {
      title: 'Date Requested',
      dataIndex: 'dateRequested',
      key: 'dateRequested',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 800,
      render: (status) => {
        const { label, color } = statusMap[status] || {};
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action1',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/manage-borrow-requests/${record.id}`)}
          >
            View Details
          </Button>
        </Space>
      ),
    },
    {
      title: 'Approve/Reject',
      key: 'action2',
      render: (_, record) => (
        <Space>
          <Button
            color="green"
            variant="outlined"
            icon={<CheckOutlined />}
            onClick={() => handleUpdate(record.id, 1)}
            disabled={record.status !== 0 || isUpdating}
          />

          <Button
            color="danger"
            variant="outlined"
            icon={<CloseOutlined />}
            onClick={() => handleUpdate(record.id, 2)}
            disabled={record.status !== 0 || isUpdating}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-8">
      <Title level={1}>Manage Borrow Requests</Title>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
};

export default ManageBorrowRequestsPage;