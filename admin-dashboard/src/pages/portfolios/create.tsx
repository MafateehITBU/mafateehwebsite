import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import { ImageUploadField } from "../../components/ImageUploadField";

export const PortfolioCreate = () => {
  const { formProps, saveButtonProps, form } = useForm({ resource: "portfolios" });
  const { selectProps: catProps } = useSelect({
    resource: "portfolio_categories",
    optionLabel: "name",
    optionValue: "id",
  });
  const { selectProps: tagProps } = useSelect({
    resource: "tags",
    optionLabel: "name",
    optionValue: "id",
  });
  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
          <Select {...catProps} />
        </Form.Item>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="slug" label="Slug (optional)">
          <Input />
        </Form.Item>
        <Form.Item
          name="shortDescription"
          label="Short description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <ImageUploadField
          form={form}
          fieldName="featuredImageUrl"
          label="Featured image"
          folder="portfolios"
        />
        <Form.Item name="link" label="External link">
          <Input />
        </Form.Item>
        <Form.Item name="tagIds" label="Tags">
          <Select {...tagProps} mode="multiple" allowClear />
        </Form.Item>
      </Form>
    </Create>
  );
};
