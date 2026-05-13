import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
import { ImageUploadField } from "../../components/ImageUploadField";
import { FormSection } from "../../components/ui";

export const PartnerCreate = () => {
  const { formProps, saveButtonProps, form } = useForm({ resource: "partners" });
  return (
    <Create saveButtonProps={saveButtonProps}>
      <FormSection title="Partner Details" description="Add partner name and brand logo.">
        <Form {...formProps} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <ImageUploadField form={form} fieldName="logoUrl" label="Logo" folder="partners" />
        </Form>
      </FormSection>
    </Create>
  );
};
