import { useEffect } from "react";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import { ImageUploadField } from "../../components/ImageUploadField";

type PortfolioRecord = {
  id?: string;
  tags?: { tag?: { id: string } }[];
};

export const PortfolioEdit = () => {
  const { formProps, saveButtonProps, query, form } = useForm<PortfolioRecord>({
    resource: "portfolios",
  });
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

  const record = query?.data?.data;
  useEffect(() => {
    if (!record?.id) return;
    const tagIds =
      record.tags?.map((t) => t.tag?.id).filter((id): id is string => Boolean(id)) ?? [];
    form.setFieldsValue({ tagIds } as { tagIds: string[] });
  }, [record?.id, record?.tags, form]);

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={query?.isLoading ?? false}>
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
    </Edit>
  );
};
