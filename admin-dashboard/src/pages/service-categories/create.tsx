import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const ServiceCategoryCreate = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "service_categories" });
  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item name="name" label="Name (English)" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="nameAr" label="Name (Arabic)" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="slug" label="Slug (optional)">
          <Input />
        </Form.Item>
      </Form>
    </Create>
  );
};
