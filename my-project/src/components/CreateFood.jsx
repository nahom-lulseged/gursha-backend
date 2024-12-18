import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, message, Select, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { apiUrl } from '../utils/apiUrl';

const CreateFood = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const categoryOptions = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'hotdrink', label: 'Hot Drink' },
    { value: 'juice', label: 'Juice' },
    { value: 'beverage', label: 'Beverage' }
  ];

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/foods/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to create food item');
      }

      const data = await response.json();
      message.success('Food item created successfully!');
      form.resetFields();
    } catch (error) {
      message.error('Failed to create food item: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Food Item</h2>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4"
      >
        <Form.Item
          label="Food Name"
          name="name"
          rules={[{ required: true, message: 'Please enter food name' }]}
        >
          <Input className="w-full" />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: 'Please enter price' }]}
        >
          <InputNumber
            min={0}
            className="w-full"
            step={0.01}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <Input.TextArea 
            className="w-full" 
            rows={4}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.List
          name="pictures"
          initialValue={['']}
          rules={[
            {
              validator: async (_, pictures) => {
                if (!pictures || pictures.length === 0) {
                  return Promise.reject(new Error('At least one picture is required'));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  label={index === 0 ? "Picture Uploads" : ""}
                  required={false}
                  key={field.key}
                >
                  <Space direction="horizontal" className="w-full">
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          validator: async (_, value) => {
                            const fileInput = document.getElementById(`fileInput-${field.key}`);
                            const fileUploaded = fileInput && fileInput.files.length > 0;
                            if (!value && !fileUploaded) {
                              return Promise.reject(new Error("Please enter a picture URL or upload a file"));
                            }
                          },
                        },
                      ]}
                      noStyle
                    >
                      <Input 
                        placeholder="Enter picture URL" 
                        className="w-full"
                      />
                    </Form.Item>
                    <input 
                      type="file" 
                      accept="image/*" 
                      id={`fileInput-${field.key}`} // Unique ID for each file input
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            // You can handle the uploaded image here
                            console.log(reader.result); // For example, log the image data URL
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                      className="cursor-pointer" 
                    />
                    {fields.length > 1 && (
                      <MinusCircleOutlined
                        className="text-red-500 hover:text-red-700"
                        onClick={() => remove(field.name)}
                      />
                    )}
                  </Space>
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  className="w-full"
                >
                  Add Picture URL
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item
          label="Category"
          name="type"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select
            className="w-full"
            placeholder="Select a category"
            options={categoryOptions}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Create Food Item
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateFood;