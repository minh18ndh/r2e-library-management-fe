import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Card, Form, Input, Spin, Alert, Button, Space, message, Select } from 'antd';
import { useGetBooksQuery, useUpdateBookMutation } from '../store/services/bookApi';
import { useGetCategoriesQuery } from '../store/services/categoryApi';

const { Title } = Typography;
const { TextArea } = Input;

const AdminBookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { data: books, isLoading: isBooksLoading, error } = useGetBooksQuery({});
  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();

  const book = books?.find((b) => String(b.id) === id);

  if (isBooksLoading || isCategoriesLoading) return <Spin />;
  if (error || !book) return <Alert message="Book not found" type="error" showIcon />;

  const handleFinish = async (values) => {
    try {
      await updateBook({ id: book.id, ...values }).unwrap();
      message.success('Book updated successfully');
      navigate('/manage-books');
    } catch {
      message.error('Failed to update book');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <Title level={2}>Edit Book</Title>
      <Card style={{ maxWidth: 600 }}>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            ...book,
            categoryId: book.categoryId, // set dropdown initial value
          }}
          onFinish={handleFinish}
        >
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="author" label="Author" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={5} />
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
            <Select placeholder="Select category">
              {categories?.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={isUpdating}>
                Save
              </Button>
              <Button onClick={() => navigate('/manage-books')}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminBookDetailsPage;