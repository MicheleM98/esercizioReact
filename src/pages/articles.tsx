/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button, Card, Col, Row } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import CardCover from "../components/card-cover";
import Api from "../services/api-service";
import { useState } from "react";
import LinkTitle from "../components/link";
import { ArticleType } from "../utils/article-type";
import ArticleModal from "../components/article-modal";

const { Meta } = Card;

export function Articles() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const showCreateModal = () => {
    setIsCreateModalOpen(true);
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

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCloseDetailModal = () => {
    setIsDetailsModalOpen(false);
  };

  const { data, refetch } = useQuery<ArticleType[]>(
    ["article"],
    Api.getArticles,
    {
      keepPreviousData: true,
    }
  );

  const { mutateAsync: deleteArticle } = useMutation(Api.deleteArticle, {
    onSuccess: () => {
      refetch();
    },
  });

  const handleDeleteArticleClick = async (articleId: string) => {
    await deleteArticle(articleId);
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
                  <LinkTitle
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
      <ArticleModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        method="create"
        id=""
        createdAt=""
        name=""
        sellerId=""
        description=""
        buyUrl=""
      />
      <ArticleModal
        open={isDetailsModalOpen}
        onClose={handleCloseDetailModal}
        method="update"
        id={detailId}
        createdAt={createdAt}
        name={name}
        sellerId={sellerId}
        description={description}
        buyUrl={buyUrl}
      />
    </>
  );
}
