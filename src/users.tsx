import { useQuery, useMutation } from '@tanstack/react-query';
import { Button, Card, Modal, Col, Row, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import CardCover from './components/cardCover';
import Api from './apiService'
import { useState } from 'react';

const { Meta } = Card;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};

type User = {
  createdAt: string,
  name: string,
  avatar: string,
  birthdate: string,
  articlesIds: Array<number>,
  id: string
}

export function Users() {

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const showCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
  };
  
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [birthdate, setBirtdate] = useState("");
  const [articlesIds, setArticlesIds] = useState("");

  const showUpdateModal = (user: User) => {
    setIsUpdateModalOpen(true);
    setCreatedAt(user.createdAt);
    setName(user.name);
    setAvatar(user.avatar);
    setBirtdate(user.birthdate);
    setArticlesIds(String(user.articlesIds));
    setUpdateId(user.id);
  };

  const handleUpdateCancel = () => {
    setIsUpdateModalOpen(false);
    refetch();
  };

  const [form] = Form.useForm();

  const { data, refetch } = useQuery<User[]>(['users'], Api.getUsers, {keepPreviousData: true});

  const { mutateAsync: createUser } = useMutation(Api.createUser, {
    onSuccess: () => {
      refetch();
    }
  });

  const { mutateAsync: deleteUser } = useMutation(Api.deleteUser, {
    onSuccess: () => {
      refetch();
    }
  });

  const handleCreateUserClick = async () => {
  const newUser = {
      createdAt: form.getFieldValue('createdAt'),
      name: form.getFieldValue('name'),
      avatar: form.getFieldValue('avatar'),
      birthdate: form.getFieldValue('birthdate'),    
      articlesIds: [1, 2, 3],
      id: String(Math.random())
    };

    try {
      const createdUser = await createUser(newUser);
      console.log('Nuovo utente creato:', createdUser);
      handleCreateCancel();
    } catch (error) {
      console.error('Errore durante la creazione dell\'utente:', error);
    }
  };

  const handleUpdateArticlesClick = async (userId: string) => {
    const updatedUser = {
      createdAt: form.getFieldValue('createdAt'),
      name: form.getFieldValue('name'),
      avatar: form.getFieldValue('avatar'),
      birthdate: form.getFieldValue('birthdate'),
      articlesIds: [1, 2, 3],
      id: userId
    }
    try {
      const modifiedUser = await Api.updateUser(userId, updatedUser);
      console.log('Utente modificate:', modifiedUser);
      handleUpdateCancel();
    } catch (error) {
      console.error('Errore durante la modifica dell\'utente:', error);
    }
  };
  
  const handleDeleteUserClick = async (userId: string) => {
    try {
      await deleteUser(userId);
      console.log(`Utente con ID ${userId} eliminato con successo.`);
    } catch (error) {
      console.error(`Errore durante l'eliminazione dell'utente con ID ${userId}:`, error);
    }
  };

  return (
    <>
      <Button style={{ margin: 20, fontSize: 20, height: 40}} icon={<PlusCircleOutlined />} onClick={ showCreateModal } type='primary'>Aggiungi Utente</Button>
      <Row>
        {data?.map((user) =>
          <Col key={user.id} span={4}>
            <Card
              hoverable
              style={{ width: 300, margin: 10 }}
              cover={
                <CardCover src={user.avatar} />
              }
              actions={[
                <EditOutlined key="edit" onClick={ () => showUpdateModal(user) }/>,
                <DeleteOutlined key="delete" onClick={ () => handleDeleteUserClick(user.id) }/>,
              ]}
            >
              <Meta
                title={user.name}
                description={user.createdAt}
              />
            </Card>
          </Col>
        )}
      </Row>
      <Modal open={isCreateModalOpen} onOk={ () => handleCreateUserClick() } onCancel={ handleCreateCancel } destroyOnClose={true}>
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          style={{ maxWidth: 600 }}
        >
          <Form.Item name="createdAt" label="Data Creazione" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="avatar" label="Avatar" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="birthDate" label="Data di Nascita" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="articlesIds" label="Articoli in vendita" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal open={isUpdateModalOpen} onOk={ () => handleUpdateArticlesClick(updateId) } onCancel={ handleUpdateCancel } destroyOnClose={true}>
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          style={{ maxWidth: 600 }}
        >
          <Form.Item name="createdAt" label="Data Creazione" rules={[{ required: true }]}>
            <Input defaultValue={createdAt}/>
          </Form.Item>
          <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
            <Input defaultValue={name}/>
          </Form.Item>
          <Form.Item name="avatar" label="Avatar" rules={[{ required: true }]}>
            <Input defaultValue={avatar}/>
          </Form.Item>
          <Form.Item name="birthDate" label="Data di Nascita" rules={[{ required: true }]}>
            <Input defaultValue={birthdate}/>
          </Form.Item>
          <Form.Item name="articlesIds" label="Articoli in vendita" rules={[{ required: true }]}>
            <Input defaultValue={articlesIds}/>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
