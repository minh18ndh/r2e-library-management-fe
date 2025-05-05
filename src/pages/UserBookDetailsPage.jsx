import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Card, Spin, Alert, Button, Space, Divider } from 'antd';
import { useGetBooksQuery } from '../store/services/bookApi';
import { useGetCategoriesQuery } from '../store/services/categoryApi';

const { Title, Text, Paragraph } = Typography;

const UserBookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: books, isLoading: isBooksLoading, error: bookError } = useGetBooksQuery();
  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery();

  if (isBooksLoading || isCategoriesLoading) return <Spin />;
  if (bookError) return <Alert message="Failed to load book" type="error" showIcon />;

  const book = books?.find((b) => String(b.id) === id);
  const category = categories?.find((c) => c.id === book?.categoryId);

  if (!book) return <Alert message="Book not found" type="error" showIcon />;

  return (
    <div className="min-h-screen p-8">
      <Title level={2} className="mb-6">Book Details</Title>
      <Card style={{ maxWidth: 700 }}>
        <Typography>
          <Title level={4}>Title</Title>
          <Text strong>{book.title}</Text>

          <Divider />

          <Title level={4}>Author</Title>
          <Text>{book.author}</Text>

          <Divider />

          <Title level={4}>Category</Title>
          <Text>{category?.name || 'Unknown'}</Text>

          <Divider />

          <Title level={4}>Description</Title>
          <Paragraph style={{ whiteSpace: 'pre-wrap' }} ellipsis={false}>
            {book.description}
          </Paragraph>

          <Divider />

          <Title level={4}>Available Quantity</Title>
          <Text>{book.quantity}</Text>
        </Typography>

        <Divider />

        <Space>
          <Button onClick={() => navigate('/books')}>Back to Books</Button>
        </Space>
      </Card>
    </div>
  );
};

export default UserBookDetailsPage;