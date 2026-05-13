import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const PortfolioCategoryCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "portfolio_categories",
  });
  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="slug" label="Slug (optional)">
          <Input />
        </Form.Item>
      </Form>
    </Create>
  );
};
