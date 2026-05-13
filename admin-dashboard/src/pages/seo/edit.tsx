import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
import { ImageUploadField } from "../../components/ImageUploadField";

export const SeoEdit = () => {
  const { formProps, saveButtonProps, query, form } = useForm({ resource: "seo" });

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={query?.isLoading ?? false}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Google Tag ID" name="googleTagId">
          <Input />
        </Form.Item>
        <Form.Item label="Meta title" name="metaTitle">
          <Input />
        </Form.Item>
        <Form.Item label="Meta description" name="metaDescription">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Meta keywords" name="metaKeywords">
          <Input />
        </Form.Item>
        <ImageUploadField
          form={form}
          fieldName="ogImageUrl"
          label="OG image"
          folder="seo"
        />
      </Form>
    </Edit>
  );
};
