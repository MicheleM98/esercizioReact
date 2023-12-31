/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, Modal, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArticleType } from "../utils/article-type";
import Api from "../services/api-service";

const { TextArea } = Input;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};

const picture = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const ArticleModal: React.FC<{
  open: boolean;
  method: string;
  createdAt: string;
  name: string;
  sellerId: string | number;
  description: string;
  buyUrl: string;
  id: string;
  onClose: () => void;
}> = ({
  open,
  method,
  createdAt,
  name,
  sellerId,
  description,
  buyUrl,
  id,
  onClose,
}) => {
  const [form] = Form.useForm();

  const { refetch } = useQuery<ArticleType[]>(["article"], Api.getArticles, {
    keepPreviousData: true,
  });

  const { mutateAsync: createArticle } = useMutation(Api.createArticle, {
    onSuccess: () => {
      refetch();
    },
  });

  const { mutateAsync: updateArticle } = useMutation(Api.updateArticle, {
    onSuccess: () => {
      refetch();
    },
  });

  const handleCancel = () => {
    onClose();
  };

  const handleCreateArticlesClick = async () => {
    form.validateFields();
    const fieldErrors = form.getFieldsError([
      "createdAt",
      "name",
      "picture",
      "sellerId",
      "description",
      "buyUrl",
    ]);
    const isInvalid = fieldErrors.some((fe) => fe.errors.length > 0);
    if (!isInvalid) {
      const newArticle = {
        createdAt: form.getFieldValue("createdAt"),
        name: form.getFieldValue("name"),
        picture: form.getFieldValue("picture"),
        sellerId: form.getFieldValue("sellerId"),
        description: form.getFieldValue("description"),
        buyUrl: form.getFieldValue("buyUrl"),
        id: String(Math.random()),
      };
      await createArticle(newArticle);
    }
  };

  const handleUpdateArticlesClick = async (articleId: string) => {
    const updatedArticle = {
      createdAt: form.getFieldValue("createdAt"),
      name: form.getFieldValue("name"),
      picture: form.getFieldValue("picture"),
      sellerId: form.getFieldValue("sellerId"),
      description: form.getFieldValue("description"),
      buyUrl: form.getFieldValue("buyUrl"),
      id: articleId,
    };
    await updateArticle({
      id: articleId,
      article: updatedArticle,
    });
  };

  const handleMethod = () => {
    if (method === "create") {
      handleCreateArticlesClick();
    } else if (method === "update") {
      handleUpdateArticlesClick(id);
    }
    handleCancel();
  };

  return (
    <Modal
      open={open}
      onOk={handleMethod}
      onCancel={handleCancel}
      destroyOnClose={true}
    >
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        style={{ maxWidth: 600 }}
        preserve={false}
      >
        <Form.Item
          name="createdAt"
          label="Data Creazione"
          rules={[{ required: true }]}
        >
          <Input defaultValue={createdAt} />
        </Form.Item>
        <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
          <Input defaultValue={name} />
        </Form.Item>
        <Form.Item
          name="upload"
          label="Upload"
          valuePropName="fileList"
          getValueFromEvent={picture}
        >
          <Upload
            multiple={false}
            maxCount={1}
            name="logo"
            listType="picture"
            beforeUpload={(file) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => {
                form.setFieldValue("picture", reader.result);
              };
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}> Upload </Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="sellerId"
          label="Venditore"
          rules={[{ required: true }]}
        >
          <Input defaultValue={sellerId} />
        </Form.Item>
        <Form.Item
          name="description"
          label="Descrizione"
          rules={[{ required: true }]}
        >
          <TextArea rows={15} defaultValue={description} />
        </Form.Item>
        <Form.Item name="buyUrl" label="Url" rules={[{ required: true }]}>
          <Input defaultValue={buyUrl} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ArticleModal;
