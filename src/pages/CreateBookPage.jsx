import { Typography, Card, Form, Input, Button, Space, message, Select, Spin, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAddBookMutation } from '../store/services/bookApi';
import { useGetCategoriesQuery } from '../store/services/categoryApi';

const { Title } = Typography;

const CreateBookPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [addBook, { isLoading: isAdding }] = useAddBookMutation();
  const { data: categories, isLoading: isLoadingCategories, error } = useGetCategoriesQuery();

  const handleFinish = async (values) => {
    try {
      await addBook(values).unwrap();
      message.success('Book created successfully');
      navigate('/manage-books');
    } catch {
      message.error('Failed to create book');
    }
  };

  if (isLoadingCategories) return <Spin />;
  if (error) return <Alert message="Failed to load categories" type="error" showIcon />;

  return (
    <div className="min-h-screen p-8">
      <Title level={2}>Add New Book</Title>
      <Card style={{ maxWidth: 600 }}>
        <Form layout="vertical" form={form} onFinish={handleFinish}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="author" label="Author" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input />
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
              <Button type="primary" htmlType="submit" loading={isAdding}>
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

export default CreateBookPage;