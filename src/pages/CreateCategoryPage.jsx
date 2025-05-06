import { Typography, Card, Form, Input, Button, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAddCategoryMutation } from '../store/services/categoryApi';

const { Title } = Typography;

const CreateCategoryPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [addCategory, { isLoading }] = useAddCategoryMutation();

  const handleFinish = async (values) => {
    try {
      await addCategory(values).unwrap();
      message.success('Category created successfully');
      navigate('/manage-categories');
    } catch (err) {
      message.error('Failed to create category');
    }
  };

  return (
    <div className="min-h-screen flex justify-center p-8">
      <div className="w-full max-w-2xl">
        <Title level={2} className="!mb-6 text-center">Add New Category</Title>
        <Card>
          <Form layout="vertical" form={form} onFinish={handleFinish}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={isLoading}>
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

export default CreateCategoryPage;