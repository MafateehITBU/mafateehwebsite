import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import { ImageUploadField } from "../../components/ImageUploadField";
import { MultilineTextArea } from "../../components/MultilineTextArea";

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
        <Form.Item name="title" label="Title (English)" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="titleAr" label="Title (Arabic)" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="slug" label="Slug (optional)">
          <Input />
        </Form.Item>
        <Form.Item
          name="shortDescription"
          label="Short description (English)"
          rules={[{ required: true }]}
        >
          <MultilineTextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="shortDescriptionAr"
          label="Short description (Arabic)"
          rules={[{ required: true }]}
        >
          <MultilineTextArea rows={4} />
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
