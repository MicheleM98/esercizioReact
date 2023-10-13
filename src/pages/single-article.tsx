/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useParams } from "react-router-dom";
import Api from "../services/api-service";
import { useQuery } from "@tanstack/react-query";
import { Typography, Divider, Col, Row, Button, Image } from "antd";
import { useState } from "react";
import DetailTitle from "../components/detail-title";
import { ArticleType } from "../utils/article-type";
import ArticleModal from "../components/article-modal";

function SingleArticle() {
  const { id } = useParams();
  const { data: article } = useQuery(["article", id], () =>
    Api.getArticleById(String(id))
  );

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

  const handleCloseDetailModal = () => {
    setIsDetailsModalOpen(false);
  };

  const { Title } = Typography;

  if (article) {
    const creationDate = new Date(article.createdAt);

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
            <DetailTitle level={2} title="Data di creazione:" />
            <Title level={4}>{String(creationDate)}</Title>
            <Divider />
            <DetailTitle level={2} title="Titolo:" />
            <Title level={4}>{article?.name}</Title>
            <Divider />
            <DetailTitle level={2} title="Descrizione:" />
            <Title level={4}>{article?.description}</Title>
            <Divider />
            <DetailTitle level={2} title="Venditore:" />
            <Title level={4}>{article?.sellerId}</Title>
            <Divider />
            <DetailTitle level={2} title="Url:" />
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
}

export default SingleArticle;
