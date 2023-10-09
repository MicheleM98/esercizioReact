import { useQuery, useMutation } from "@tanstack/react-query";
import { Button, Card, Modal, Col, Row, Form, Input, Checkbox } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import CardCover from "./components/cardCover";
import Api from "./apiService";
import { useState } from "react";

const { Meta } = Card;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};

type Article = {
  createdAt: string;
  name: string;
  picture: string;
  sellerId: string | number;
  description: string;
  buyUrl: string;
  id: string;
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
  const [picture, setPicture] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [description, setDescription] = useState("");
  const [buyUrl, setbuyUrl] = useState("");

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailId, setDetailId] = useState("");

  const showDetailsModal = (article: Article) => {
    setIsDetailsModalOpen(true);
    setCreatedAt(article.createdAt);
    setName(article.name);
    setPicture(article.picture);
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

  const { data, refetch } = useQuery<Article[]>(["article"], Api.getArticles, {
    keepPreviousData: true,
  });
  console.log("data", data);

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
      if (isDetailsModalOpen) {
        handleDetailsCancel();
      }
      console.log(`Articolo con ID ${articleId} eliminato con successo.`);
    } catch (error) {
      console.error(
        `Errore durante l'eliminazione dell'articolo con ID ${articleId}:`,
        error
      );
    }
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
              hoverable
              style={{ margin: 10 }}
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
              <Meta title={article.name} description={article.createdAt} />
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
            name="picture"
            label="Immagine"
            rules={[{ required: true }]}
          >
            <Input />
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
            name="picture"
            label="Immagine"
            rules={[{ required: true }]}
          >
            <Input defaultValue={picture} disabled={disabled} />
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
