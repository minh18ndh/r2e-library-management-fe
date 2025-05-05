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
    <div className="min-h-screen p-8">
      <Title level={2}>Add New Category</Title>
      <Card style={{ maxWidth: 600 }}>
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
  );
};

export default CreateCategoryPage;