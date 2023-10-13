/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, Modal, Select, SelectProps, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserType } from "../utils/user-type";
import Api from "../services/apiService";

const options: SelectProps["options"] = [];

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};

const avatar = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList || [];
};

const UserModal: React.FC<{
  open: boolean;
  method: string;
  createdAt: string;
  name: string;
  birthdate: string;
  articlesIds: Array<number>;
  id: string;
  onClose: () => void;
}> = ({
  open,
  method,
  createdAt,
  name,
  birthdate,
  articlesIds,
  id,
  onClose,
}) => {
  const [form] = Form.useForm();

  const { refetch } = useQuery<UserType[]>(["users"], Api.getUsers, {
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

  const handleCancel = () => {
    onClose();
  };

  const handleCreateUserClick = async () => {
    form.validateFields();
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
      await createUser(newUser);
    }
  };

  const handleUpdateUserClick = async (userId: string) => {
    const updatedUser = {
      createdAt: form.getFieldValue("createdAt"),
      name: form.getFieldValue("name"),
      avatar: form.getFieldValue("avatar"),
      birthdate: form.getFieldValue("birthdate"),
      articlesIds: form.getFieldValue("articlesIds"),
      id: userId,
    };
    await updateUser({ id: userId, user: updatedUser });
  };

  const handleMethod = () => {
    if (method === "create") {
      handleCreateUserClick();
    } else if (method === "update") {
      handleUpdateUserClick(id);
    }
    handleCancel();
  };

  const handleSelectSearch = (text: string) => {
    if (options) {
      options[0] = { label: text, value: text };
    }
  };

  return (
    <Modal
      open={open}
      onOk={handleMethod}
      onCancel={handleCancel}
      destroyOnClose={true}
    >
      <Form {...layout} form={form} name="control-hooks" preserve={false}>
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
          getValueFromEvent={avatar}
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
    </Modal>
  );
};
export default UserModal;
