import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber } from "antd";
import { ImageUploadField } from "../../components/ImageUploadField";

export const TestimonialEdit = () => {
  const { formProps, saveButtonProps, query, form } = useForm({ resource: "testimonials" });
  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={query?.isLoading ?? false}>
      <Form {...formProps} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="position" label="Position">
          <Input />
        </Form.Item>
        <Form.Item name="rate" label="Rating (1–5)" rules={[{ required: true }]}>
          <InputNumber min={1} max={5} />
        </Form.Item>
        <Form.Item name="content" label="Content" rules={[{ required: true }]}>
          <Input.TextArea rows={6} />
        </Form.Item>
        <ImageUploadField
          form={form}
          fieldName="imageUrl"
          label="Image"
          folder="testimonials"
        />
      </Form>
    </Edit>
  );
};
