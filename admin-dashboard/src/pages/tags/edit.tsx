import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const TagEdit = () => {
  const { formProps, saveButtonProps, query } = useForm({ resource: "tags" });
  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={query?.isLoading ?? false}>
      <Form {...formProps} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="slug" label="Slug">
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
};
