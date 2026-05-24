import { Edit, useForm } from "@refinedev/antd";
import { Form } from "antd";
import { RichHtmlEditor } from "../../components/RichHtmlEditor";
import { blogContentRequired } from "../../lib/htmlContent";

export const PrivacyPolicyEdit = () => {
  const { formProps, saveButtonProps, query } = useForm({
    resource: "privacy_policy",
  });

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={query?.isLoading ?? false}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Content (English)"
          name="content"
          rules={[{ validator: blogContentRequired }]}
        >
          <RichHtmlEditor
            extended
            dir="ltr"
            minHeight={360}
            placeholder="Write privacy policy in English…"
          />
        </Form.Item>
        <Form.Item
          label="Content (Arabic)"
          name="contentAr"
          rules={[{ validator: blogContentRequired }]}
        >
          <RichHtmlEditor
            extended
            dir="rtl"
            minHeight={360}
            placeholder="اكتب سياسة الخصوصية بالعربية…"
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};
