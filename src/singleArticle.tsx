/* eslint-disable react-hooks/rules-of-hooks */
import { useParams } from "react-router-dom";
import Api from "./apiService";
import { useQuery } from "@tanstack/react-query";
import { Typography, Divider, Col, Row } from "antd";
import { Image } from "antd";

function singleArticle() {
  const { id } = useParams();
  const { Title } = Typography;
  const {
    data: article,
    isLoading,
    isError,
  } = useQuery(["article", id], () => Api.getArticleById(String(id)));
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading article</div>;
  }

  return (
    <Row>
      <Col span={8}>
        <Image
          width={600}
          height={500}
          src="error"
          fallback={article.picture}
        />
      </Col>
      <Col span={16}>
        <Title level={2}>{article.createdAt}</Title>
        <Divider />
        <Title level={2}>{article.description}</Title>
        <Divider />
        <Title level={2}>{article.sellerId}</Title>
        <Divider />
        <Title level={2}>{article.buyUrl}</Title>
      </Col>
    </Row>
  );
}

export default singleArticle;
