import { Table, Typography, Tag, Spin, Alert, Button } from 'antd';
import { useGetMyBorrowRequestsQuery } from '../store/services/myBorrowRequestApi';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const statusMap = {
  0: { label: 'Pending', color: 'yellow' },
  1: { label: 'Approved', color: 'green' },
  2: { label: 'Rejected', color: 'red' },
};

const MyBorrowRequestsPage = () => {
  const { data, error, isLoading } = useGetMyBorrowRequestsQuery();
  const navigate = useNavigate();

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
      width: 1000,
      render: (status) => {
        const { label, color } = statusMap[status] || {};
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => navigate(`/my-borrow-requests/${record.id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-8">
      <Title level={1}>My Borrow Requests</Title>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
};

export default MyBorrowRequestsPage;