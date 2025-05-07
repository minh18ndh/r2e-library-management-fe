import { Table, Typography, Tag, Button, message, Space, Spin, Alert } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useGetAllBorrowRequestsQuery, useUpdateRequestStatusMutation } from '../store/services/manageBorrowRequestApi';
import { useGetBooksQuery } from '../store/services/bookApi';

const { Title } = Typography;

const statusMap = {
  0: { label: 'Pending', color: 'yellow' },
  1: { label: 'Approved', color: 'green' },
  2: { label: 'Rejected', color: 'red' },
};

const ManageBorrowRequestsPage = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetAllBorrowRequestsQuery();
  const { refetch: refetchBooks } = useGetBooksQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateRequestStatusMutation();

  const handleUpdate = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      await refetchBooks();
      message.success(`Request ${statusMap[status].label.toLowerCase()} successfully`);
    } catch {
      const detail =
        err?.data?.errors?.[0]?.detail ||
        Object.values(err?.data?.errors || {})[0]?.[0] ||
        err?.data?.title ||
        'Failed to update request status';
      message.error(detail);
    }
  };

  if (isLoading) return <Spin />;
  if (error) return <Alert message="Failed to load requests" type="error" showIcon />;

  const columns = [
    {
      title: 'Date Requested',
      dataIndex: 'dateRequested',
      key: 'dateRequested',
      render: (utc) => {
        const local = new Date(utc + 'Z');
        return local.toLocaleString(undefined, {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(',', '');
      }
    },
    {
      title: 'Requestor',
      dataIndex: 'requestorName',
      key: 'requestorName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const { label, color } = statusMap[status] || {};
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'view',
      render: (_, record) => (
        <Button type="primary" onClick={() => navigate(`/manage-borrow-requests/${record.id}`)}>
          View Details
        </Button>
      ),
    },
    {
      title: 'Approve / Reject',
      key: 'decision',
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
            danger
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