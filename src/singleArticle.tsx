/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { Link, useParams } from "react-router-dom";
import Api from "./apiService";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Typography,
  Divider,
  Col,
  Row,
  Button,
  Form,
  Input,
  Modal,
  Checkbox,
  Upload,
  Image,
} from "antd";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";

type Article = {
  createdAt: string;
  name: string;
  picture: string;
  sellerId: string | number;
  description: string;
  buyUrl: string;
  id: string;
};

function singleArticle() {
  const { id } = useParams();
  const { data: article, refetch } = useQuery(["article", id], () =>
    Api.getArticleById(String(id))
  );

  const { mutateAsync: updateArticle } = useMutation(Api.updateArticle, {
    onSuccess: () => {
      refetch();
    },
  });

  const [createdAt, setCreatedAt] = useState("");
  const [name, setName] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [description, setDescription] = useState("");
  const [buyUrl, setbuyUrl] = useState("");

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailId, setDetailId] = useState("");

  const showDetailsModal = (article: Article) => {
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

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 17 },
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
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

  const { Title } = Typography;

  const creationDate = new Date(article?.createdAt);

  return (
    <>
      <Row>
        <Col span={1}></Col>
        <Col span={7}>
          <Image
            height={500}
            style={{ objectFit: "none" }}
            src="error"
            fallback={article?.picture}
          />
        </Col>
        <Col span={1}></Col>
        <Col span={14}>
          <Title level={2} style={{ color: "#141414" }}>
            Data di creazione:
          </Title>
          <Title level={4}>{String(creationDate)}</Title>
          <Divider />
          <Title level={2} style={{ color: "#141414" }}>
            Titolo:
          </Title>
          <Title level={4}>{article?.name}</Title>
          <Divider />
          <Title level={2} style={{ color: "#141414" }}>
            Descrizione:
          </Title>
          <Title level={4}>{article?.description}</Title>
          <Divider />
          <Title level={2} style={{ color: "#141414" }}>
            Venditore:
          </Title>
          <Title level={4}>{article?.sellerId}</Title>
          <Divider />
          <Title level={2} style={{ color: "#141414" }}>
            Url:
          </Title>
          <Title level={4}>{article?.buyUrl}</Title>
          <Divider />
          <Link to="/articles">
            <Button
              style={{ margin: 20, fontSize: 20, height: 40 }}
              type="primary"
            >
              Home
            </Button>
          </Link>
          <Button
            style={{ margin: 20, fontSize: 20, height: 40 }}
            type="primary"
            onClick={() => showDetailsModal(article)}
          >
            Modifica articolo
          </Button>
        </Col>
        <Col span={1}></Col>
      </Row>
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

export default singleArticle;
