import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import { MultilineTextArea } from "../../components/MultilineTextArea";
import { IconifyIconPicker } from "../../components/IconifyIconPicker";
import { FormSection } from "../../components/ui";

export const ServiceCreate = () => {
  const { formProps, saveButtonProps, form } = useForm({ resource: "services" });
  const { selectProps } = useSelect({
    resource: "service_categories",
    optionLabel: "name",
    optionValue: "id",
  });
  return (
    <Create saveButtonProps={saveButtonProps}>
      <FormSection
        title="Service Details"
        description="Define service content, category, and an Iconify icon."
      >
        <Form {...formProps} layout="vertical">
          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Category is required" }]}
          >
            <Select {...selectProps} />
          </Form.Item>
          <Form.Item name="title" label="Title (English)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="titleAr" label="Title (Arabic)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description (English)" rules={[{ required: true }]}>
            <MultilineTextArea rows={6} />
          </Form.Item>
          <Form.Item name="descriptionAr" label="Description (Arabic)" rules={[{ required: true }]}>
            <MultilineTextArea rows={6} />
          </Form.Item>
          <IconifyIconPicker form={form} fieldName="icon" label="Icon (Iconify)" />
        </Form>
      </FormSection>
    </Create>
  );
};
