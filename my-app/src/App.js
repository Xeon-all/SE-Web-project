import {
  Button,
  Card,
  Layout,
  Input,
  message,
  Radio,
  Row,
  Col,
  Space,
  Modal,
  Slider,
} from 'antd'
import {
  InfoCircleOutlined,
  MinusSquareOutlined,
  EnvironmentOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useState, useReducer } from 'react';
import { request } from './API/api.js';
import { urls } from './API/urls.js';
import './App.css';
import pic from './Add.png'
import tagpic from './tagAdd.png'
import delpic from './delete.png'
import Item from 'antd/lib/list/Item';

const { Header, Content, Sider } = Layout;

function App() {
  const [Tasks, setTasks] = useState([]);
  const [Tags, setTags] = useState(
    [{id: 1, name: '学习', selected: 0},
    {id: 2, name: '工作', selected: 0},
    {id: 3, name: '生活', selected: 0}]
    );
  const [tagType, setType] = useState([
      'white',
      '#00c5fb',
      '#c8e78f',
      '#66b687',
      '#8fb1c5',
      '#ab8ee0',
      '#ffaec6'
    ]);
  const [token, setToken] = useState({});
  const [tempToken, setTempToken] = useState({
    user: '',
    password: '',
  });
  const [isRegisting, setIsRegisting] = useState(false);
  const [isLogIn, setIsLogIn] = useState(false);
  const [isDraggable, setIsDraggable] = useState(true);
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  const priorityLevel = [
    '#EB5558',
    '#F7CE74',
    '#F5F3B0',
    '#FFFFFF',
    '#DDDDDD'
  ]
  
  function handleAdd() {
    let newTask = {
      id: Tasks.length,
      priority: 3,
      name: `第${Tasks.length}个任务`,
      Info: '无',
      location: '', 
      selected: false,
      tag: 0,
    }
    
    let task = [...Tasks, newTask];
    setTasks(task);
  }

  function handleAddTag() {
    let newTag = {
      id: Tags.length + 1,
      name:'',
      selected: 0,
    }

    let tag = [...Tags, newTag];
    setTags(tag);
  }

  function handleDelTag(x) {
    let id = x - 1;

    if(x < Tags.length){
      let tagtype = tagType;
      let last = tagtype[6];
      tagtype[6] = tagtype[x];
      for(let i = x; i < 5; i ++){
        tagtype[i] = tagtype[i+1];
      }
      tagtype[5] = last;
      setType(tagtype);
    }

    let tag = Tags;
    tag.splice(id, 1);
    for(let i = id; i < tag.length; i ++)
    {
      tag[i].id --;
    }
    setTags(tag);

    let task = Tasks;
    for(let i = 0; i < task.length; i ++)
    {
      if(task[i].tag == x){
        task[i].tag = 0;
      }
      if(task[i].tag > x){
        task[i].tag --;
      }
    }
    setTasks(task);
    
    forceUpdate();
  }

  function handleDelete(x) {
    let task = Tasks;
    task.splice(x, 1);
    for(let i = x; i < task.length; i ++)
    {
      task[i].id = task[i].id - 1;
    }
    setTasks(task);
    forceUpdate();
  }

  function handleChangeName(e, val){
    val.name = e.target.value;
    e.target.blur();
  }

  function handleChangeLocation(e, val){
    val.location = e.target.location;
    e.target.blur();
  }

  async function logIn(){
    // let user = '1';
    // let password = '1';
    let taskn = await request('get', urls.getTasks, tempToken);
    console.log(taskn);
    if(taskn.status === 200){
      if(taskn.data === 'Wrong password'){
        message.error('密码错误!');
      }
      else if(taskn.data === 'No such user') {
        message.error('该用户不存在!');
      }
      else {
        setToken(tempToken)
        setIsLogIn(true);

        let task = [];
        for(let i = 0; i < taskn.data.length; ++i)
        {
          task.push({
            id: taskn.data[i].id,
            name: taskn.data[i].name,
            Info: taskn.data[i].Info,
            priority: taskn.data[i].priority,
            location: taskn.data[i].location,
            selected: false,
            //selectedLocation: false,
          })
        }
        setTasks(task);
        forceUpdate();
      }
    }
    
  }

  function logOut(){
    setIsLogIn(false);
    setTempToken({});
    setToken({});
    setTasks([]);
  }

  async function uploadData(tasks){
    let task = tasks.map((e) => {
      return e;
    });

    let dict = {};
    let taskn = [];
    dict.name = token.name;
    dict.password = token.password;
    dict.task = taskn;
    for(let i = 0; i <task.length; i ++)
    {
      let new_task = {};
      taskn.push(new_task);
      new_task.name = task[i].name;
      new_task.Info = task[i].Info;
      new_task.id = task[i].id;
      new_task.priority = task[i].priority;
      new_task.location = task[i].location;
    }

    let result = await request('POST', urls.postTasks, dict);
    if(result.status !== 200){
      message.error('同步任务失败!');
    }
    // const response = await axios({
    //   method: 'POST',
    //   baseURL: urls.baseUrl,
    //   url: urls.postTasks,
    //   ...token,
    //   task: tasknames[0],
    // });
    //console.log(response);
  }

  async function register(){
    let formData = new FormData();
    formData.append('name', tempToken.name);
    formData.append('password', tempToken.password);

    let result = await request('post', urls.createUser, formData);
    if(result.status && result.status === 200){
      if(result.data === 'already have the name'){
        message.error('用户名已被注册!');
      }
      else {
        message.success('注册成功');
        setIsLogIn(true);
        setToken(tempToken)
      }
    }
    else {
      message.error('注册失败: 网络问题!');
    }
  }

  function dragTask(ev, val) {
    ev.dataTransfer.setData('drag_id', val.id);
    ev.dataTransfer.setData('drag_type', 0);
  };
  
  function dragTag(ev, val) {
    ev.dataTransfer.setData('tag_id', val.id);
    ev.dataTransfer.setData('drag_type', 1);
  };

  function allowDrop(ev)
  {
    ev.preventDefault();
  }

  function dropOnTask(ev, target_id)
  {
    ev.preventDefault();
    let task = Tasks;

    if(ev.dataTransfer.getData('drag_type') == 1){
      var tag_id = ev.dataTransfer.getData('tag_id');
      task[target_id].tag = tag_id;
    }
    else{
      var drag_id = ev.dataTransfer.getData('drag_id');
      let drag_task = task[drag_id];
      task.splice(drag_id, 1);
      for(let i = drag_id; i < task.length; i ++){
        task[i].id -= 1;
      }
      task.splice(target_id, 0, drag_task);
      for(let i = target_id + 1; i < task.length; i ++){
        task[i].id += 1;
      }
      task[target_id].id = target_id;
    }

    setTasks(task);
    if(isLogIn){
      uploadData(task);
    }
    forceUpdate();
  }

  function sliderFormatter(value) {
    switch(value) {
      case 0 :
        return '要命了';
      case 1:
        return '赶紧做';
      case 2:
        return '该做了';
      case 3:
        return '不着急';
      case 4:
        return '拖着吧';
    }
  }

  return (
    <>
    <Layout>
      <Header>
        {
          isLogIn?
          <Space>
            <text style = {{color: 'white'}}>welcome! {token.name}</text>
            <Button onClick = {logOut} type = 'text' danger>log out</Button>
          </Space>
          :
          <Space>
            <Input 
            prefix = {'user:'} 
            style = {{width: "8vw",}}
            onChange = {(e) => {
              let temp = {
                name: e.target.value,
                password: tempToken.password,
              }
              setTempToken(temp)
            }}
            />
            <Input.Password 
            prefix = {'password:'} 
            style = {{width: "10vw",}}
            onChange = {(e) => {
              let temp = {
                name: tempToken.name,
                password: e.target.value,
              }
              setTempToken(temp)
            }}
            />
            { 
              !isRegisting
              ? <Button onClick = {logIn}> log in </Button>
              : <Button onClick = {register}>register </Button>}
            <Radio 
              checked = {isRegisting}
              onClick = {() => {setIsRegisting(!isRegisting)}}
              style = {{color: 'white'}}
              > 
              register 
            </Radio>
          </Space>
        }

      </Header>
      <Layout>
        <Sider class = 'Sider' style = {{background: '#49C7CD', minHeight: '90vh'}} collapsible>
          {Tags.map((val, index, arr) => {
            return (
              <div 
              class = {val.id == 1? "Tag1":"Tag"}
              key = {index}
              style = {{backgroundColor: tagType[val.id]}}
              draggable = {isDraggable}
              onDragStart = {(e) => dragTag(e, val)}
              onMouseOver = {() => {val.selected = true; forceUpdate();}}
              onMouseOut={() => {val.selected = false; forceUpdate();}}
              >
              <Row>
                <Col>
                  <Input 
                  bordered = {0}
                  value = {arr[index].name}
                  style = {{width: "4vw"}}
                  onFocus = {() => {setIsDraggable(false); forceUpdate();}}
                  onBlur = {(e) => {
                    arr[index].name = e.target.value;
                    setTags(arr);
                    setIsDraggable(true);
                    if(isLogIn){
                      uploadData(arr);
                    }
                    val.selected = false;
                    forceUpdate();}}
                    onChange = {({ target: { value } }) => {
                    let tag = Tags;
                    tag[index].name = value;
                    setTags(tag);
                    forceUpdate();}}
                    onPressEnter = {(e) => {handleChangeName(e, val);}}/>
                </Col>
                <div class = 'del' >
                  <img src={delpic} alt = 'del' 
                  width = '40%' height = '40%'
                  style = {{visibility: val.selected == 1? 'visible':'hidden'}}
                  onClick = {() => handleDelTag(val.id)}/>
                </div>
              </Row>
            </div>
          )})}
          <div 
          style = {{backgroundColor: 'white', visibility: Tags.length < 6? 'visible':'hidden'}}
          class = "TagAdd" 
          onClick = {handleAddTag}>
            <img src={tagpic} alt = 'add' 
            width = '40%' height = '40%' 
            style = {{marginTop: '30%', marginLeft: '30%'}}/>
          </div>
        </Sider>
        <Content>
        <div class = "Add">
          <img src = {pic} alt = 'add' width = '100%' height = '100%' 
          onClick = {handleAdd}/>
        </div>
          {Tasks.map((val, index, arr) => {
            return (
              <Card 
              style = {{margin: '20px', backgroundColor: priorityLevel[val.priority]}}
              draggable = {isDraggable}
              onDragStart = {(e) => dragTask(e, val)}
              onDragOver = {(e) => allowDrop(e)}
              onDrop = {(e) => dropOnTask(e, val.id)}>
                <Row align = 'middle' gutter = {16}>
                  <Col>
                    <MinusSquareOutlined onClick = {() => {handleDelete(val.id)}}/>
                  </Col>
                  <Col>
                    <Input
                    bordered = {val.selected}
                    onFocus = {() => {val.selected = true; setIsDraggable(false); forceUpdate();}}
                    onBlur = {(e) => {
                      arr[index].name = e.target.value;
                      setTasks(arr);
                      setIsDraggable(true);
                      if(isLogIn){
                        uploadData(arr);
                      }
                      val.selected = false;
                      forceUpdate();}}
                    value = {Tasks[index].name}
                    onChange = {({ target: { value } }) => {
                      let task = Tasks;
                      task[index].name = value;
                      setTasks(task);
                      forceUpdate();}}
                    onPressEnter = {(e) => {handleChangeName(e, val);}}
                    style = {{width: "10vw", backgroundColor: tagType[val.tag]}}/>
                  </Col>
                  <Col span = {2}>
                    <Slider
                    max = {4}
                    min = {0}
                    value = {val.priority}
                    defaultValue = {3}
                    tipFormatter={sliderFormatter}
                    onChange = {(value) => {
                      let task = Tasks;
                      task[index].priority = value;
                      setTasks(task);
                      if(isLogIn){
                        uploadData(task);
                      }
                      forceUpdate();}}
                    />
                  </Col>
                  <Col>
                    <EnvironmentOutlined style = {{paddingRight: '1rem'}}/>
                    <Input
                    bordered = {val.selectedLocation}
                    onFocus = {() => {val.selectedLocation = true; setIsDraggable(false); forceUpdate();}}
                    onBlur = {(e) => {
                      arr[index].location = e.target.value;
                      setTasks(arr);
                      setIsDraggable(true);
                      if(isLogIn){
                        uploadData(arr);
                      }
                      val.selectedLocation = false;
                      forceUpdate();}}
                    value = {Tasks[index].location}
                    onChange = {({ target: { value } }) => {
                      let task = Tasks;
                      task[index].location = value;
                      setTasks(task);
                      forceUpdate();}}
                    onPressEnter = {(e) => {handleChangeLocation(e, val);}}
                    style = {{width: "10vw",}}/>
                  </Col>
                  <Col offset = {10}>
                    <InfoCircleOutlined onClick = {() => {val.showInfo = true; forceUpdate();}}/>
                    <Modal
                    title = '任务详细信息'
                    visible = {val.showInfo}
                    onOK = {() => {val.showInfo = false; forceUpdate();}}
                    onCancel = {() => {val.showInfo = false; forceUpdate();}}
                    footer = {[
                      <Button
                      type = 'primary'
                      onClick = {() => {val.showInfo = false; forceUpdate();}}
                      >
                        确认
                      </Button>
                    ]}
                    >
                      <p>{val.Info}</p>
                    </Modal>
                  </Col>
                </Row>
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
