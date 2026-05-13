import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import { ADMIN_PERMISSION_OPTIONS } from "../../constants/adminPermissions";

export const RoleCreate = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "roles" });
  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item
          name="permissions"
          label="Permissions"
          rules={[{ required: true, message: "Select at least one permission" }]}
        >
          <Select
            mode="multiple"
            allowClear
            options={ADMIN_PERMISSION_OPTIONS}
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </Create>
  );
};
