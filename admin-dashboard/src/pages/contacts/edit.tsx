import { Edit, useForm } from "@refinedev/antd";
import { Form, Select } from "antd";
import type { IContact } from "../../interfaces";

export const ContactEdit = () => {
  const { formProps, saveButtonProps, query } = useForm<IContact>();

  return (
    <Edit
      saveButtonProps={saveButtonProps}
      isLoading={query?.isLoading ?? false}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item label="Status" name="status" rules={[{ required: true }]}>
          <Select
            options={[
              { value: "NEW", label: "New" },
              { value: "READ", label: "Read" },
              { value: "ARCHIVED", label: "Archived" },
            ]}
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};
