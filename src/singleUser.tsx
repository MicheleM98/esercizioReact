/* eslint-disable react-hooks/rules-of-hooks */
import { Link, useParams } from "react-router-dom";
import Api from "./apiService";
import { useQuery } from "@tanstack/react-query";
import { Typography, Divider, Col, Row, Button } from "antd";
import { Image } from "antd";

function singleUser() {
  const { id } = useParams();
  const { Title } = Typography;
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery(["user", id], () => Api.getUserById(String(id)));
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
          fallback={user.avatar}
        />
      </Col>
      <Col span={1}></Col>
      <Col span={14}>
        <Title level={2} style={{ color: "#141414" }}>
          Data di creazione:
        </Title>
        <Title level={4}>{user.createdAt}</Title>
        <Divider />
        <Title level={2} style={{ color: "#141414" }}>
          Nome:
        </Title>
        <Title level={4}>{user.name}</Title>
        <Divider />
        <Title level={2} style={{ color: "#141414" }}>
          Data di nascita:
        </Title>
        <Title level={4}>{user.birthdate}</Title>
        <Divider />
        <Title level={2} style={{ color: "#141414" }}>
          Articoli in vendita:
        </Title>
        <Title level={4}>{user.articlesIds}</Title>
        <Divider />
        <Link to="/users">
          <Button type="primary">Home</Button>
        </Link>
        <Button style={{ margin: 20, fontSize: 20, height: 40 }} type="primary">
          Modifica utente
        </Button>
      </Col>
      <Col span={1}></Col>
    </Row>
  );
}

export default singleUser;
