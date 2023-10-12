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
  Select,
  Checkbox,
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import CardCover from "./components/cardCover";
import Api from "./apiService";
import { useState } from "react";
import LinkMod from "./components/link";

import type { SelectProps } from "antd";

const options: SelectProps["options"] = [];

const { Meta } = Card;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};

type User = {
  createdAt: string;
  name: string;
  avatar: string;
  birthdate: string;
  articlesIds: Array<number>;
  id: string;
};

export function Users() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const showCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
  };

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailId, setDetailId] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [name, setName] = useState("");
  const [birthdate, setBirtdate] = useState("");
  const [articlesIds, setArticlesIds] = useState("");

  const showDetailsModal = (user: User) => {
    setIsDetailsModalOpen(true);
    const createdAtDate = new Date(user.createdAt);
    setCreatedAt(createdAtDate.toDateString());
    setName(user.name);
    setBirtdate(user.birthdate);
    setArticlesIds(user.articlesIds as any);
    setDetailId(user.id);
  };

  const handleDetailsCancel = () => {
    setIsDetailsModalOpen(false);
  };

  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);

  const toggleDisable = () => {
    setDisabled(!disabled);
  };

  const { data, refetch } = useQuery<User[]>(["users"], Api.getUsers, {
    keepPreviousData: true,
  });

  const { mutateAsync: createUser } = useMutation(Api.createUser, {
    onSuccess: () => {
      refetch();
    },
  });

  const { mutateAsync: updateUser } = useMutation(Api.updateUser, {
    onSuccess: () => {
      refetch();
    },
  });

  const { mutateAsync: deleteUser } = useMutation(Api.deleteUser, {
    onSuccess: () => {
      refetch();
    },
  });

  const handleCreateUserClick = async () => {
    form.validateFields();
    setTimeout(async () => {
      const fieldErrors = form.getFieldsError([
        "createdAt",
        "name",
        "avatar",
        "birthdate",
        "articlesIds",
      ]);
      const isInvalid = fieldErrors.some((fe) => fe.errors.length > 0);
      if (!isInvalid) {
        const newUser = {
          createdAt: form.getFieldValue("createdAt"),
          name: form.getFieldValue("name"),
          avatar: form.getFieldValue("avatar"),
          birthdate: form.getFieldValue("birthdate"),
          articlesIds: form.getFieldValue("articlesIds"),
          id: String(Math.random()),
        };

        try {
          const createdUser = await createUser(newUser);
          console.log("Nuovo utente creato:", createdUser);
          handleCreateCancel();
        } catch (error) {
          console.error("Errore durante la creazione dell'utente:", error);
        }
      }
    });
  };

  const handleUpdateArticlesClick = async (userId: string) => {
    const updatedUser = {
      createdAt: form.getFieldValue("createdAt"),
      name: form.getFieldValue("name"),
      avatar: form.getFieldValue("avatar"),
      birthdate: form.getFieldValue("birthdate"),
      articlesIds: form.getFieldValue("articlesIds"),
      id: userId,
    };
    try {
      const modifiedUser = await updateUser({ id: userId, user: updatedUser });
      console.log("Utente modificate:", modifiedUser);
      handleDetailsCancel();
    } catch (error) {
      console.error("Errore durante la modifica dell'utente:", error);
    }
  };

  const handleDeleteUserClick = async (userId: string) => {
    try {
      await deleteUser(userId);
      console.log(`Utente con ID ${userId} eliminato con successo.`);
    } catch (error) {
      console.error(
        `Errore durante l'eliminazione dell'utente con ID ${userId}:`,
        error
      );
    }
  };

  const handleSelectSearch = (text: string) => {
    if (options) {
      options[0] = { label: text, value: text };
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList || [];
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
                title={<LinkMod id={user.id} title={user.name} />}
                description={user.birthdate}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        open={isCreateModalOpen}
        onOk={() => handleCreateUserClick()}
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
                  form.setFieldValue("avatar", reader.result);
                };
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}> Upload </Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="birthDate"
            label="Data di Nascita"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="articlesIds"
            label="Articoli in vendita"
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
              options={options}
              onSearch={handleSelectSearch}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={isDetailsModalOpen}
        onCancel={handleDetailsCancel}
        afterClose={toggleDisable}
        destroyOnClose={true}
        footer={null}
      >
        <Form {...layout} form={form} name="control-hooks" preserve={false}>
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
                  form.setFieldValue("avatar", reader.result);
                };
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}> Upload </Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="birthDate"
            label="Data di Nascita"
            rules={[{ required: true }]}
          >
            <Input defaultValue={birthdate} disabled={disabled} />
          </Form.Item>
          <Form.Item
            name="articlesIds"
            label="Articoli in vendita"
            rules={[{ required: true }]}
          >
            <Select
              disabled={disabled}
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
              options={options}
              onSearch={handleSelectSearch}
              defaultValue={articlesIds}
            />
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
