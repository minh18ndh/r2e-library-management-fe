import { Typography, Card, Form, Input, Button, Space, message, Select, Spin, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAddBookMutation } from '../store/services/bookApi';
import { useGetCategoriesQuery } from '../store/services/categoryApi';

const { Title } = Typography;
const { TextArea } = Input;

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
    } catch (err) {
      const detail =
        err?.data?.errors?.[0]?.detail ||
        Object.values(err?.data?.errors || {})[0]?.[0] ||
        err?.data?.title ||
        'Failed to create book';
      message.error(detail);
    }
  };

  if (isLoadingCategories) return <Spin />;
  if (error) return <Alert message="Failed to load categories" type="error" showIcon />;

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <Title level={2} className="!mb-6 text-center">Add New Book</Title>
        <Card>
          <Form layout="vertical" form={form} onFinish={handleFinish}>
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
                <Button type="primary" htmlType="submit" loading={isAdding}>
                  Save
                </Button>
                <Button onClick={() => navigate('/manage-books')}>Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateBookPage;