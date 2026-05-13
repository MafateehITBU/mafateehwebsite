import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const TagCreate = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "tags" });
  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="slug" label="Slug (optional)">
          <Input placeholder="Auto from name if empty" />
        </Form.Item>
      </Form>
    </Create>
  );
};
