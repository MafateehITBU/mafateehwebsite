import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, Switch } from "antd";

export const AdminCreate = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "admins" });
  const { selectProps } = useSelect({
    resource: "roles",
    optionLabel: "name",
    optionValue: "id",
  });
  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true, min: 8 }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item name="name" label="Name">
          <Input />
        </Form.Item>
        <Form.Item name="roleId" label="Role" rules={[{ required: true }]}>
          <Select {...selectProps} />
        </Form.Item>
        <Form.Item name="isActive" label="Active" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
      </Form>
    </Create>
  );
};
