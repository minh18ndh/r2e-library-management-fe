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
        <div className="min-h-screen p-8">
            <Title level={2} style={{ marginBottom: 24 }}>Borrow Request Details</Title>
            <Card style={{ maxWidth: 800 }}>
                <Typography>
                    {role === 'Admin' && (
                        <>
                            <Title level={4}>Requestor ID</Title>
                            <Text>{request.requestorId}</Text>
                            <Divider />
                        </>
                    )}

                    <Title level={4}>Date Requested</Title>
                    <Text>{new Date(request.dateRequested).toLocaleString()}</Text>

                    <Divider />

                    <Title level={4}>Status</Title>
                    <Text>{statusMap[request.status]}</Text>

                    <Divider />

                    <Title level={4}>Books in Request</Title>
                    <List
                        bordered
                        dataSource={request.details}
                        renderItem={(item, index) => (
                            <List.Item>
                                <strong>{index + 1}. </strong> {item.bookTitle}
                            </List.Item>
                        )}
                    />
                </Typography>

                <Divider />

                <Space>
                    <Button
                        onClick={() =>
                            navigate(role === 'Admin' ? '/manage-borrow-requests' : '/my-borrow-requests')
                        }
                    >
                        Back to Borrow Requests
                    </Button>
                </Space>
            </Card>
        </div>
    );
};

export default BorrowRequestDetailsPage;