import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Select } from "antd";

export const PackageCreate = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "packages" });
  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="shortDescription"
          label="Short description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="privileges"
          label="Privileges (type and press Enter)"
          rules={[{ required: true, message: "Add at least one privilege" }]}
        >
          <Select mode="tags" tokenSeparators={[","]} placeholder="e.g. Feature A" />
        </Form.Item>
        <Form.Item name="sortOrder" label="Sort order" initialValue={0}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Create>
  );
};
