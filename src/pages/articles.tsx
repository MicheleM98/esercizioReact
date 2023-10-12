/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Button,
  Card,
  Modal,
  Col,
  Row,
  Form,
  Input,
  Checkbox,
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import CardCover from "../components/card-cover";
import Api from "../services/apiService";
import { useState } from "react";
import LinkMod from "../components/link";
import { ArticleType } from "../utils/article-type";

const { Meta } = Card;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};

export function Articles() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const showCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
  };

  const [createdAt, setCreatedAt] = useState("");
  const [name, setName] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [description, setDescription] = useState("");
  const [buyUrl, setbuyUrl] = useState("");

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailId, setDetailId] = useState("");

  const showDetailsModal = (article: ArticleType) => {
    setIsDetailsModalOpen(true);
    const createdAtDate = new Date(article.createdAt);
    setCreatedAt(createdAtDate.toDateString());
    setName(article.name);
    setSellerId(String(article.sellerId));
    setDescription(article.description);
    setbuyUrl(article.buyUrl);
    setDetailId(article.id);
  };

  const handleDetailsCancel = () => {
    setIsDetailsModalOpen(false);
  };

  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [disabled, setDisabled] = useState(true);

  const toggleDisable = () => {
    setDisabled(!disabled);
  };

  const { data, refetch } = useQuery<ArticleType[]>(
    ["article"],
    Api.getArticles,
    {
      keepPreviousData: true,
    }
  );

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

  const { mutateAsync: deleteArticle } = useMutation(Api.deleteArticle, {
    onSuccess: () => {
      refetch();
    },
  });

  const handleCreateArticlesClick = async () => {
    form.validateFields();
    setTimeout(async () => {
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
        try {
          const createdArticle = await createArticle(newArticle);
          console.log("Nuovo articolo creato:", createdArticle);
          handleCreateCancel();
        } catch (error) {
          console.error("Errore durante la creazione dell'articolo:", error);
        }
      }
    });
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
    try {
      const modifiedArticle = await updateArticle({
        id: articleId,
        article: updatedArticle,
      });
      console.log("Articolo modificate:", modifiedArticle);
      handleDetailsCancel();
    } catch (error) {
      console.error("Errore durante la modifica dell'articolo:", error);
    }
  };

  const handleDeleteArticleClick = async (articleId: string) => {
    try {
      await deleteArticle(articleId);
      console.log(`Articolo con ID ${articleId} eliminato con successo.`);
    } catch (error) {
      console.error(
        `Errore durante l'eliminazione dell'articolo con ID ${articleId}:`,
        error
      );
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <>
      <Button
        style={{ margin: 20, fontSize: 20, height: 40 }}
        icon={<PlusCircleOutlined />}
        onClick={showCreateModal}
        type="primary"
      >
        Aggiungi Articolo
      </Button>
      <Row>
        {data?.map((article) => (
          <Col key={article.id} span={4}>
            <Card
              style={{ margin: 10, height: 365 }}
              cover={<CardCover src={article.picture} />}
              actions={[
                <EditOutlined
                  key="edit"
                  onClick={() => showDetailsModal(article)}
                />,
                <DeleteOutlined
                  key="delete"
                  onClick={() => handleDeleteArticleClick(article.id)}
                />,
              ]}
            >
              <Meta
                title={
                  <LinkMod
                    page="article"
                    id={article.id}
                    title={article.name}
                  />
                }
                description={article.buyUrl}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        open={isCreateModalOpen}
        onOk={() => handleCreateArticlesClick()}
        onCancel={handleCreateCancel}
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
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="upload"
            label="Upload"
            valuePropName="fileList"
            getValueFromEvent={normFile}
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
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descrizione"
            rules={[{ required: true }]}
          >
            <TextArea rows={15} />
          </Form.Item>
          <Form.Item name="buyUrl" label="Url" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={isDetailsModalOpen}
        destroyOnClose={true}
        footer={null}
        onCancel={handleDetailsCancel}
        afterClose={toggleDisable}
      >
        <Form {...layout} form={form} name="control-hooks">
          <Checkbox style={{ marginBottom: 20 }} onChange={toggleDisable}>
            Abilita modifica
          </Checkbox>
          <Form.Item
            name="createdAt"
            label="Data Creazione"
            rules={[{ required: true }]}
          >
            <Input defaultValue={createdAt} disabled={disabled} />
          </Form.Item>
          <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
            <Input defaultValue={name} disabled={disabled} />
          </Form.Item>
          <Form.Item
            name="upload"
            label="Upload"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              multiple={false}
              maxCount={1}
              disabled={disabled}
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
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="sellerId"
            label="Venditore"
            rules={[{ required: true }]}
          >
            <Input defaultValue={sellerId} disabled={disabled} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descrizione"
            rules={[{ required: true }]}
          >
            <TextArea
              rows={15}
              defaultValue={description}
              disabled={disabled}
            />
          </Form.Item>
          <Form.Item name="buyUrl" label="Url" rules={[{ required: true }]}>
            <Input defaultValue={buyUrl} disabled={disabled} />
          </Form.Item>
        </Form>
        <Button
          style={{ margin: 10 }}
          onClick={() => handleUpdateArticlesClick(detailId)}
          disabled={disabled}
          type="primary"
        >
          Salva modifiche
        </Button>
      </Modal>
    </>
  );
}
