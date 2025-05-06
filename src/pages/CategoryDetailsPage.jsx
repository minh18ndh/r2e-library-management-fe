import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Card, Form, Input, Spin, Alert, Button, Space, message } from 'antd';
import { useGetCategoriesQuery, useUpdateCategoryMutation } from '../store/services/categoryApi';

const { Title } = Typography;

const CategoryDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { data: categories, isLoading, error } = useGetCategoriesQuery();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const category = categories?.find((c) => String(c.id) === id);

  if (isLoading) return <Spin />;
  if (error || !category) return <Alert message="Category not found" type="error" showIcon />;

  const handleFinish = async (values) => {
    try {
      await updateCategory({ id: category.id, ...values }).unwrap();
      message.success('Category updated successfully');
      navigate('/manage-categories');
    } catch (err) {
      message.error('Failed to update category');
    }
  };

  return (
    <div className="min-h-screen flex justify-center p-8">
      <div className="w-full max-w-2xl">
        <Title level={2} className="!mb-6 text-center">Edit Category</Title>
        <Card>
          <Form
            layout="vertical"
            form={form}
            initialValues={category}
            onFinish={handleFinish}
          >
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={isUpdating}>
                  Save
                </Button>
                <Button onClick={() => navigate('/manage-categories')}>Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CategoryDetailsPage;