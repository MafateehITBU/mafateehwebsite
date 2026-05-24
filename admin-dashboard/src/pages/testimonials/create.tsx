import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber } from "antd";
import { ImageUploadField } from "../../components/ImageUploadField";
import { MultilineTextArea } from "../../components/MultilineTextArea";

export const TestimonialCreate = () => {
  const { formProps, saveButtonProps, form } = useForm({ resource: "testimonials" });
  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item name="name" label="Name (English)" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="nameAr" label="Name (Arabic)" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="position" label="Position (English)">
          <Input />
        </Form.Item>
        <Form.Item name="positionAr" label="Position (Arabic)" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="rate"
          label="Rating (1–5)"
          rules={[{ required: true }]}
          initialValue={5}
        >
          <InputNumber min={1} max={5} />
        </Form.Item>
        <Form.Item name="content" label="Content (English)" rules={[{ required: true }]}>
          <MultilineTextArea rows={6} />
        </Form.Item>
        <Form.Item name="contentAr" label="Content (Arabic)" rules={[{ required: true }]}>
          <MultilineTextArea rows={6} />
        </Form.Item>
        <ImageUploadField
          form={form}
          fieldName="imageUrl"
          label="Image"
          folder="testimonials"
        />
      </Form>
    </Create>
  );
};
