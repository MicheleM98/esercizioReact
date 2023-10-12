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
  Select,
  SelectProps,
} from "antd";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import TitleMod from "./components/title";

type User = {
  createdAt: string;
  name: string;
  avatar: string;
  birthdate: string;
  articlesIds: Array<number>;
  id: string;
};

function singleUser() {
  const { id } = useParams();
  const { data: user, refetch } = useQuery(["user", id], () =>
    Api.getUserById(String(id))
  );

  const { mutateAsync: updateUser } = useMutation(Api.updateUser, {
    onSuccess: () => {
      refetch();
    },
  });

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

  const options: SelectProps["options"] = [];

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

  const { Title } = Typography;

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 17 },
  };
  const creationDate = new Date(user?.createdAt);
  return (
    <>
      <Row>
        <Col span={1}></Col>
        <Col span={7}>
          <Image
            height={500}
            style={{ objectFit: "none" }}
            src="error"
            fallback={user?.avatar}
          />
        </Col>
        <Col span={1}></Col>
        <Col span={14}>
          <TitleMod level={2} title="Data di creazione:" />
          <Title level={4}>{String(creationDate)}</Title>
          <Divider />
          <TitleMod level={2} title="Nome:" />
          <Title level={4}>{user?.name}</Title>
          <Divider />
          <TitleMod level={2} title="Data di nascita:" />
          <Title level={4}>{user?.birthdate}</Title>
          <Divider />
          <TitleMod level={2} title="Articoli in vendita:" />
          <Title level={4}>{user?.articlesIds}</Title>
          <Divider />
          <Link to="/users">
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
            onClick={() => showDetailsModal(user)}
          >
            Modifica utente
          </Button>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Modal
        open={isDetailsModalOpen}
        onCancel={handleDetailsCancel}
        afterClose={toggleDisable}
        destroyOnClose={true}
        footer={null}
      >
        <Form
          {...(
            <Modal
              open={isDetailsModalOpen}
              onCancel={handleDetailsCancel}
              afterClose={toggleDisable}
              destroyOnClose={true}
              footer={null}
            >
              <Form
                {...layout}
                form={form}
                name="control-hooks"
                preserve={false}
              >
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
                <Form.Item
                  name="name"
                  label="Nome"
                  rules={[{ required: true }]}
                >
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
          )}
          form={form}
          name="control-hooks"
          preserve={false}
        >
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

export default singleUser;
