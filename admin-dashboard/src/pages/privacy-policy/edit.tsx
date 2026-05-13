import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const PrivacyPolicyEdit = () => {
  const { formProps, saveButtonProps, query } = useForm({
    resource: "privacy_policy",
  });

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={query?.isLoading ?? false}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Content is required" }]}
        >
          <Input.TextArea rows={16} />
        </Form.Item>
      </Form>
    </Edit>
  );
};
