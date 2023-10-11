/* eslint-disable react-hooks/rules-of-hooks */
import { Link, useParams } from "react-router-dom";
import Api from "./apiService";
import { useQuery } from "@tanstack/react-query";
import { Typography, Divider, Col, Row, Button } from "antd";
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
      <Col span={1}></Col>
      <Col span={7}>
        <Image
          height={500}
          style={{ objectFit: "none" }}
          src="error"
          fallback={article.picture}
        />
      </Col>
      <Col span={1}></Col>
      <Col span={14}>
        <Title level={2} style={{ color: "#141414" }}>
          Data di creazione:
        </Title>
        <Title level={4}>{article.createdAt}</Title>
        <Divider />
        <Title level={2} style={{ color: "#141414" }}>
          Titolo:
        </Title>
        <Title level={4}>{article.name}</Title>
        <Divider />
        <Title level={2} style={{ color: "#141414" }}>
          Descrizione:
        </Title>
        <Title level={4}>{article.description}</Title>
        <Divider />
        <Title level={2} style={{ color: "#141414" }}>
          Venditore:
        </Title>
        <Title level={4}>{article.sellerId}</Title>
        <Divider />
        <Title level={2} style={{ color: "#141414" }}>
          Url:
        </Title>
        <Title level={4}>{article.buyUrl}</Title>
        <Divider />
        <Link to="/articles">
          <Button type="primary">Home</Button>
        </Link>
      </Col>
      <Col span={1}></Col>
    </Row>
  );
}

export default singleArticle;
