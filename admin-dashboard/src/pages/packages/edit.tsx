import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Select } from "antd";
import { MultilineTextArea } from "../../components/MultilineTextArea";

export const PackageEdit = () => {
  const { formProps, saveButtonProps, query } = useForm({ resource: "packages" });
  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={query?.isLoading ?? false}>
      <Form {...formProps} layout="vertical">
        <Form.Item name="name" label="Name (English)" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="nameAr" label="Name (Arabic)" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="shortDescription"
          label="Short description (English)"
          rules={[{ required: true }]}
        >
          <MultilineTextArea rows={3} />
        </Form.Item>
        <Form.Item
          name="shortDescriptionAr"
          label="Short description (Arabic)"
          rules={[{ required: true }]}
        >
          <MultilineTextArea rows={3} />
        </Form.Item>
        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="privileges"
          label="Privileges (English)"
          rules={[{ required: true, message: "Add at least one privilege" }]}
        >
          <Select mode="tags" tokenSeparators={[","]} />
        </Form.Item>
        <Form.Item
          name="privilegesAr"
          label="Privileges (Arabic)"
          rules={[{ required: true, message: "Add at least one privilege" }]}
        >
          <Select mode="tags" tokenSeparators={[","]} />
        </Form.Item>
        <Form.Item name="sortOrder" label="Sort order">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Edit>
  );
};
