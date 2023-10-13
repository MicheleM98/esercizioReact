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
import LinkMod from "../components/link";
import { UserType } from "../utils/user-type";
import UserModal from "../components/user-modal";

const { Meta } = Card;

export function Users() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const showCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailId, setDetailId] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [name, setName] = useState("");
  const [birthdate, setBirtdate] = useState("");
  const [articlesIds, setArticlesIds] = useState([]);

  const showDetailsModal = (user: UserType) => {
    setIsDetailsModalOpen(true);
    const createdAtDate = new Date(user.createdAt);
    setCreatedAt(createdAtDate.toDateString());
    setName(user.name);
    setBirtdate(user.birthdate);
    setArticlesIds(user.articlesIds as any);
    setDetailId(user.id);
  };

  const handleCloseDetailModal = () => {
    setIsDetailsModalOpen(false);
  };

  const { data, refetch } = useQuery<UserType[]>(["users"], Api.getUsers, {
    keepPreviousData: true,
  });

  const { mutateAsync: deleteUser } = useMutation(Api.deleteUser, {
    onSuccess: () => {
      refetch();
    },
  });

  const handleDeleteUserClick = async (userId: string) => {
    await deleteUser(userId);
  };

  return (
    <>
      <Button
        style={{ margin: 20, fontSize: 20, height: 40 }}
        icon={<PlusCircleOutlined />}
        onClick={showCreateModal}
        type="primary"
      >
        Aggiungi Utente
      </Button>
      <Row>
        {data?.map((user) => (
          <Col key={user.id} span={4}>
            <Card
              style={{ margin: 10, height: 365 }}
              cover={<CardCover src={user.avatar} />}
              actions={[
                <EditOutlined
                  key="edit"
                  onClick={() => showDetailsModal(user)}
                />,
                <DeleteOutlined
                  key="delete"
                  onClick={() => handleDeleteUserClick(user.id)}
                />,
              ]}
            >
              <Meta
                title={<LinkMod page="user" id={user.id} title={user.name} />}
                description={user.birthdate}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <UserModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        method="create"
        id=""
        createdAt=""
        name=""
        birthdate=""
        articlesIds={[]}
      />
      <UserModal
        open={isDetailsModalOpen}
        onClose={handleCloseDetailModal}
        method="update"
        id={detailId}
        createdAt={createdAt}
        name={name}
        birthdate={birthdate}
        articlesIds={articlesIds}
      />
    </>
  );
}
