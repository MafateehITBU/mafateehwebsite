import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import { ImageUploadField } from "../../components/ImageUploadField";
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
        description="Refine service information and icon presentation."
      >
        <Form {...formProps} layout="vertical">
          <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
            <Select {...selectProps} />
          </Form.Item>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={6} />
          </Form.Item>
          <ImageUploadField form={form} fieldName="iconUrl" label="Icon image" folder="services" />
        </Form>
      </FormSection>
    </Edit>
  );
};
