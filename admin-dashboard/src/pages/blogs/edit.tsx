import { useEffect } from "react";
import { usePermissions } from "@refinedev/core";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import {
  Button,
  Divider,
  Form,
  Input,
  Select,
  Space,
  Switch,
  Upload,
} from "antd";
import { useState } from "react";
import { getToken } from "../../providers/authProvider";
import { notify } from "../../lib/notify";
import { BlogRichTextEditor } from "../../components/BlogRichTextEditor";
import { blogContentRequired } from "../../lib/htmlContent";
import { FormSection } from "../../components/ui";

type BlogRecord = {
  id?: string;
  tags?: { tag?: { id: string } }[];
};

export const BlogEdit = () => {
  const { data: permissionsData } = usePermissions<string[]>({});
  const permissions = Array.isArray(permissionsData) ? permissionsData : [];
  const canCreateTags = permissions.includes("*") || permissions.includes("tags");
  const { formProps, saveButtonProps, query, form } = useForm<BlogRecord>({
    resource: "blogs",
  });
  const [newTagName, setNewTagName] = useState("");
  const [creatingTag, setCreatingTag] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tagOptions, setTagOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const featuredImageUrl = Form.useWatch("featuredImageUrl", form);
  const { selectProps: catProps } = useSelect({
    resource: "blog_categories",
    optionLabel: "name",
    optionValue: "id",
  });
  const { selectProps: tagProps } = useSelect({
    resource: "tags",
    optionLabel: "name",
    optionValue: "id",
  });
  useEffect(() => {
    setTagOptions(
      ((tagProps.options as { label: string; value: string }[] | undefined) ??
        [])
    );
  }, [tagProps.options]);

  const record = query?.data?.data;
  useEffect(() => {
    if (!record?.id) return;
    const tagIds =
      record.tags?.map((t) => t.tag?.id).filter((id): id is string => Boolean(id)) ?? [];
    form.setFieldsValue({ tagIds } as { tagIds: string[] });
  }, [record?.id, record?.tags, form]);

  const createTag = async () => {
    const name = newTagName.trim();
    if (!name) return;
    const token = getToken();
    if (!token) {
      notify.error("Missing auth token");
      return;
    }
    setCreatingTag(true);
    try {
      const res = await fetch("/api/admin/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to create tag");
      const tag = JSON.parse(text) as { id: string; name: string };
      const option = { value: tag.id, label: tag.name };
      setTagOptions((prev) =>
        prev.some((x) => x.value === option.value) ? prev : [...prev, option]
      );
      const current = (form.getFieldValue("tagIds") as string[] | undefined) ?? [];
      if (!current.includes(tag.id)) {
        form.setFieldValue("tagIds", [...current, tag.id]);
      }
      setNewTagName("");
      notify.success("Tag created");
    } catch (e) {
      const err = e instanceof Error ? e.message : "Failed to create tag";
      notify.error(err);
    } finally {
      setCreatingTag(false);
    }
  };

  const uploadFeaturedImage = async (file: File) => {
    const token = getToken();
    if (!token) {
      notify.error("Missing auth token");
      return;
    }
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload?folder=blogs", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Image upload failed");
      const body = JSON.parse(text) as { url: string };
      form.setFieldValue("featuredImageUrl", body.url);
      notify.success("Featured image uploaded");
    } catch (e) {
      const err = e instanceof Error ? e.message : "Image upload failed";
      notify.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={query?.isLoading ?? false}>
      <FormSection
        title="Edit Blog"
        description="Update content, publish state, and related tags."
      >
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
          <Form.Item
            name="content"
            label="Content (English)"
            rules={[{ validator: blogContentRequired }]}
          >
            <BlogRichTextEditor dir="ltr" placeholder="Write content in English…" />
          </Form.Item>
          <Form.Item
            name="contentAr"
            label="Content (Arabic)"
            rules={[{ validator: blogContentRequired }]}
          >
            <BlogRichTextEditor dir="rtl" placeholder="اكتب المحتوى بالعربية…" />
          </Form.Item>
          <Form.Item label="Featured image">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Upload
                accept="image/*"
                maxCount={1}
                showUploadList={false}
                beforeUpload={(file) => {
                  void uploadFeaturedImage(file);
                  return Upload.LIST_IGNORE;
                }}
              >
                <Button loading={uploadingImage}>Upload Featured Image</Button>
              </Upload>
              {featuredImageUrl ? (
                <img
                  src={featuredImageUrl}
                  alt="Featured"
                  style={{ maxHeight: 120, width: "auto", objectFit: "contain" }}
                />
              ) : null}
            </Space>
          </Form.Item>
          <Form.Item name="featuredImageUrl" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="published" label="Published" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="tagIds" label="Tags">
            <Select
              {...tagProps}
              options={tagOptions}
              mode="multiple"
              allowClear
              dropdownRender={
                canCreateTags
                  ? (menu) => (
                      <>
                        {menu}
                        <Divider style={{ margin: "8px 0" }} />
                        <Space.Compact style={{ width: "100%", padding: "0 8px 8px" }}>
                          <Input
                            placeholder="New tag name"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            onPressEnter={createTag}
                          />
                          <Button loading={creatingTag} onClick={createTag}>
                            Add
                          </Button>
                        </Space.Compact>
                      </>
                    )
                  : undefined
              }
            />
          </Form.Item>
        </Form>
      </FormSection>
    </Edit>
  );
};
