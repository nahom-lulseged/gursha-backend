import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, message } from 'antd';
import { apiUrl } from '../utils/apiUrl';

const CreateHotel = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/hotels/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to create hotel');
      }

      const data = await response.json();
      message.success('Hotel created successfully!');
      // Reset form
      form.resetFields();
    } catch (error) {
      message.error('Failed to create hotel: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const [form] = Form.useForm();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Hotel</h2>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4"
      >
        <Form.Item
          label="Hotel Name"
          name="name"
          rules={[{ required: true, message: 'Please enter hotel name' }]}
        >
          <Input className="w-full" />
        </Form.Item>

        <Form.Item
          label="Rating"
          name="rating"
          rules={[{ required: true, message: 'Please enter rating' }]}
        >
          <InputNumber
            min={0}
            max={5}
            className="w-full"
            step={0.5}
          />
        </Form.Item>

        <Form.Item
          label="Picture URL"
          name="picture"
          rules={[{ required: true, message: 'Please enter picture URL' }]}
        >
          <Input className="w-full" />
        </Form.Item>

        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: 'Please enter location' }]}
        >
          <Input className="w-full" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Create Hotel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateHotel;
