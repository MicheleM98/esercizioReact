/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useParams } from "react-router-dom";
import Api from "../services/api-service";
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
  Upload,
  Image,
  Select,
  SelectProps,
} from "antd";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import DetailTitle from "../components/detail-title";
import { UserType } from "../utils/user-type";

function SingleUser() {
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

  const showDetailsModal = (user: UserType) => {
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

  const handleUpdateArticlesClick = async (userId: string) => {
    const updatedUser = {
      createdAt: form.getFieldValue("createdAt"),
      name: form.getFieldValue("name"),
      avatar: form.getFieldValue("avatar"),
      birthdate: form.getFieldValue("birthdate"),
      articlesIds: form.getFieldValue("articlesIds"),
      id: userId,
    };
    const modifiedUser = await updateUser({ id: userId, user: updatedUser });
    console.log("Utente modificate:", modifiedUser);
    handleDetailsCancel();
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
  if (user) {
    const creationDate = new Date(user.createdAt);
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
            <DetailTitle level={2} title="Data di creazione:" />
            <Title level={4}>{String(creationDate)}</Title>
            <Divider />
            <DetailTitle level={2} title="Nome:" />
            <Title level={4}>{user?.name}</Title>
            <Divider />
            <DetailTitle level={2} title="Data di nascita:" />
            <Title level={4}>{user?.birthdate}</Title>
            <Divider />
            <DetailTitle level={2} title="Articoli in vendita:" />
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
          destroyOnClose={true}
          footer={null}
        >
          <Form
            {...(
              <Modal
                open={isDetailsModalOpen}
                onCancel={handleDetailsCancel}
                destroyOnClose={true}
                footer={null}
              >
                <Form
                  {...layout}
                  form={form}
                  name="control-hooks"
                  preserve={false}
                >
                  <Form.Item
                    name="createdAt"
                    label="Data Creazione"
                    rules={[{ required: true }]}
                  >
                    <Input defaultValue={createdAt} />
                  </Form.Item>
                  <Form.Item
                    name="name"
                    label="Nome"
                    rules={[{ required: true }]}
                  >
                    <Input defaultValue={name} />
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
                    <Input defaultValue={birthdate} />
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
                      defaultValue={articlesIds}
                    />
                  </Form.Item>
                </Form>
                <Button
                  style={{ margin: 10 }}
                  onClick={() => handleUpdateArticlesClick(detailId)}
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
            <Form.Item
              name="createdAt"
              label="Data Creazione"
              rules={[{ required: true }]}
            >
              <Input defaultValue={createdAt} />
            </Form.Item>
            <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
              <Input defaultValue={name} />
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
              <Input defaultValue={birthdate} />
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
                defaultValue={articlesIds}
              />
            </Form.Item>
          </Form>
          <Button
            style={{ margin: 10 }}
            onClick={() => handleUpdateArticlesClick(detailId)}
            type="primary"
          >
            Salva modifiche
          </Button>
        </Modal>
      </>
    );
  }
}

export default SingleUser;
