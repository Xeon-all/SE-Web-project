import {
  Button,
  Card,
  Layout,
} from 'antd'
import {
  PlusCircleOutlined,
  MinusSquareOutlined,
} from '@ant-design/icons'
import { useState, useReducer } from 'react'
import './App.css';

const { Header, Content, Sider } = Layout;

function App() {
  const [Tasks, setTasks] = useState([]);
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleAdd() {
    let newTask = {
      id: Tasks.length,
      key: 2,
    }
    let task = [...Tasks, newTask];
    setTasks(task);
  }

  function handleDelete(id) {
    let task = Tasks;
    console.log(task[id]);
    task.splice(id, 1);
    setTasks(task);
    forceUpdate();
  }

  return (
    <>
    <Layout>
      <Header>
        <Button style = {{marginLeft: '50%'}} onClick = {handleAdd}>
          add
        </Button>
      </Header>
      <Layout>
        <Sider style = {{background: '#49C7CD', minHeight: '90vh'}} collapsible></Sider>
        <Content>
          {Tasks.map((val) => {
            return (
              <Card style = {{margin: '20px'}}>
                <MinusSquareOutlined onClick = {() => {handleDelete(val.id)}}/>
                {`第${val.id}个任务`}
                <PlusCircleOutlined style = {{float: 'right'}}/>
              </Card>
            )
          })}
        </Content>
        <Sider style = {{background: '#49C7CD', minHeight: '90vh'}} collapsible></Sider>
      </Layout>
    </Layout>
    </>
  );
}

export default App;
