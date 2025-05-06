import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Card, Spin, Alert, Button, Space, Divider, List } from 'antd';
import { useGetMyBorrowRequestsQuery } from '../store/services/myBorrowRequestApi';
import { useGetAllBorrowRequestsQuery } from '../store/services/manageBorrowRequestApi';
import { getUserRole } from '../utils/auth';

const { Title, Text } = Typography;

const statusMap = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected',
};

const BorrowRequestDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = getUserRole();

  const {
    data: userRequests,
    isLoading: isUserLoading,
    error: userError,
  } = useGetMyBorrowRequestsQuery(undefined, { skip: role !== 'User' });

  const {
    data: adminRequests,
    isLoading: isAdminLoading,
    error: adminError,
  } = useGetAllBorrowRequestsQuery(undefined, { skip: role !== 'Admin' });

  const data = role === 'Admin' ? adminRequests : userRequests;
  const isLoading = role === 'Admin' ? isAdminLoading : isUserLoading;
  const error = role === 'Admin' ? adminError : userError;

  const request = data?.find((r) => String(r.id) === id);

  if (isLoading) return <Spin />;
  if (error || !request) return <Alert message="Request not found" type="error" showIcon />;

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <div>
          <Title level={2} className="!mb-6 text-center">Borrow Request Details</Title>
        </div>

        <div>
          <Card>
            <Typography>
              {role === 'Admin' && (
                <>
                  <div>
                    <Title level={4} className="!mb-1">Requestor ID</Title>
                    <Text>{request.requestorId}</Text>
                    <Divider />
                  </div>
                  <div>
                    <Title level={4} className="!mb-1">Requestor Name</Title>
                    <Text>{request.requestorName}</Text>
                    <Divider />
                  </div>
                </>
              )}

              {request.approverId && (
                <>
                  <div>
                    <Title level={4} className="!mb-1">Moderator ID</Title>
                    <Text>{request.approverId}</Text>
                    <Divider />
                  </div>
                  <div>
                    <Title level={4} className="!mb-1">Moderator Name</Title>
                    <Text>{request.approverName}</Text>
                    <Divider />
                  </div>
                </>
              )}

              <div>
                <Title level={4} className="!mb-1">Date Requested</Title>
                <Text>
                  {new Date(request.dateRequested + 'Z')
                    .toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    })
                    .replace(',', '')}
                </Text>
                <Divider />
              </div>

              <div>
                <Title level={4} className="!mb-1">Status</Title>
                <Text>{statusMap[request.status]}</Text>
                <Divider />
              </div>

              <div>
                <Title level={4} className="!mb-2">Books in Request</Title>
                <List
                  bordered
                  dataSource={request.details}
                  renderItem={(item, index) => (
                    <List.Item>
                      <strong>{index + 1}. </strong> {item.bookTitle}
                    </List.Item>
                  )}
                />
              </div>
            </Typography>

            <Divider />

            <div className="text-left">
              <Space>
                <Button
                  onClick={() =>
                    navigate(role === 'Admin' ? '/manage-borrow-requests' : '/my-borrow-requests')
                  }
                >
                  Back to Borrow Requests
                </Button>
              </Space>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BorrowRequestDetailsPage;