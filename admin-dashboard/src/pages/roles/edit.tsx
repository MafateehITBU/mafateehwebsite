import { useEffect } from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import { ADMIN_PERMISSION_OPTIONS } from "../../constants/adminPermissions";

type RoleRecord = { permissions?: unknown };

export const RoleEdit = () => {
  const { formProps, saveButtonProps, query, form } = useForm<RoleRecord>({
    resource: "roles",
  });

  const record = query?.data?.data;
  useEffect(() => {
    if (!record || !("permissions" in record)) return;
    const raw = record.permissions;
    const permissions = Array.isArray(raw)
      ? raw.map((p) => String(p))
      : [];
    form.setFieldsValue({ permissions });
  }, [record, form]);

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={query?.isLoading ?? false}>
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
    </Edit>
  );
};
