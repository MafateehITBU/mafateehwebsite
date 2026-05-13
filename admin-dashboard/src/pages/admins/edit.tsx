import { useEffect } from "react";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, Switch } from "antd";

export const AdminEdit = () => {
  const { formProps, saveButtonProps, query, form } = useForm({ resource: "admins" });
  const { selectProps } = useSelect({
    resource: "roles",
    optionLabel: "name",
    optionValue: "id",
  });

  const record = query?.data?.data as { role?: { id?: string } } | undefined;
  useEffect(() => {
    if (record?.role?.id) {
      form.setFieldsValue({ roleId: record.role.id });
    }
  }, [record?.role?.id, form]);

  const mergedFormProps = {
    ...formProps,
    onFinish: async (values: Record<string, unknown>) => {
      const v = { ...values };
      if (v.password === "" || v.password == null) {
        delete v.password;
      }
      return formProps.onFinish?.(v as never);
    },
  };

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={query?.isLoading ?? false}>
      <Form {...mergedFormProps} layout="vertical">
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="New password (optional)"
          rules={[{ min: 8, message: "Min 8 characters if set" }]}
        >
          <Input.Password placeholder="Leave blank to keep current" />
        </Form.Item>
        <Form.Item name="name" label="Name">
          <Input />
        </Form.Item>
        <Form.Item name="roleId" label="Role" rules={[{ required: true }]}>
          <Select {...selectProps} />
        </Form.Item>
        <Form.Item name="isActive" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Edit>
  );
};
