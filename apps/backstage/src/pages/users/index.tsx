import { TableProps, Tag, Space, Table, Button } from 'antd';

interface DataType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isOrganizer: boolean;
  createdAt: string;
  updatedAt: string;
}

function updateOrganizer() {}

const columns: TableProps<DataType>['columns'] = [
  { title: 'Id', dataIndex: 'id', key: 'id' },
  {
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName',
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Is Organizer',
    key: 'isOrganizer',
    dataIndex: 'isOrganizer',
    render: (isOrganizer) => {
      console.log('isOrganizer', isOrganizer);
      let color = 'blue';
      if (isOrganizer) {
        color = 'red';
      }
      return (
        <Tag color={color}>{isOrganizer ? 'Organizer' : 'Not Organizer'}</Tag>
      );
    },
  },
  {
    title: 'Created at',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  { title: 'Last Updated', dataIndex: 'updatedAt', key: 'updatedAt' },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => {
      console.log('record', record);
      return (
        <Space size="middle">
          <Button onClick={updateOrganizer} type="default">
            {record.isOrganizer ? 'Remove Organizer' : 'Add Organizer'}
          </Button>
        </Space>
      );
    },
  },
];

const data: DataType[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Brown',
    email: 'john@gmail.com',
    isOrganizer: true,
    createdAt: '2021-09-01',
    updatedAt: '2021-09-01',
  },
  {
    id: '2',
    firstName: 'Jim',
    lastName: 'Green',
    email: 'jim@gmail.com',
    isOrganizer: false,
    createdAt: '2021-09-01',
    updatedAt: '2021-09-01',
  },
];

export default function Users() {
  return (
    <div>
      <h1>Users</h1>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}
