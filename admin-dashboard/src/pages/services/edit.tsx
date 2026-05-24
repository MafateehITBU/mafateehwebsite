import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import { MultilineTextArea } from "../../components/MultilineTextArea";
import { IconifyIconPicker } from "../../components/IconifyIconPicker";
import { FormSection } from "../../components/ui";

export const ServiceEdit = () => {
  const { formProps, saveButtonProps, query, form } = useForm({ resource: "services" });
  const { selectProps } = useSelect({
    resource: "service_categories",
    optionLabel: "name",
    optionValue: "id",
  });
  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={query?.isLoading ?? false}>
      <FormSection
        title="Edit Service"
        description="Update service content and Iconify icon."
      >
        <Form {...formProps} layout="vertical">
          <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
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
    </Edit>
  );
};
