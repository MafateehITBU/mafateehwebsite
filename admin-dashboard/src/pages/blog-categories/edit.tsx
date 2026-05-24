import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const BlogCategoryEdit = () => {
  const { formProps, saveButtonProps, query } = useForm({
    resource: "blog_categories",
  });
  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={query?.isLoading ?? false}>
      <Form {...formProps} layout="vertical">
        <Form.Item name="name" label="Name (English)" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="nameAr" label="Name (Arabic)" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="slug" label="Slug">
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
};
