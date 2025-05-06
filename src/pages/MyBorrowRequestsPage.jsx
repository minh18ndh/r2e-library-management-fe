import { Table, Typography, Tag, Spin, Alert, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useGetMyBorrowRequestsQuery } from '../store/services/myBorrowRequestApi';

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
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => navigate(`/my-borrow-requests/${record.id}`)}>
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