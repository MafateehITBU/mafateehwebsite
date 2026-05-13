import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
import { ImageUploadField } from "../../components/ImageUploadField";
import { FormSection } from "../../components/ui";

export const PartnerEdit = () => {
  const { formProps, saveButtonProps, query, form } = useForm({ resource: "partners" });
  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={query?.isLoading ?? false}>
      <FormSection title="Edit Partner" description="Update partner identity and logo asset.">
        <Form {...formProps} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <ImageUploadField form={form} fieldName="logoUrl" label="Logo" folder="partners" />
        </Form>
      </FormSection>
    </Edit>
  );
};
