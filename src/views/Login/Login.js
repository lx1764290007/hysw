import {Button, Form, Input, Layout} from "antd";
import "./login.css";
import {HeaderBar} from "../../components/HeaderBar/HeaderBar";
import {FieldNumberOutlined, SecurityScanOutlined, UserOutlined} from "@ant-design/icons";
import * as PropTypes from "prop-types";
import React from "react";
import {ValidCode} from "../../components/ValidCode/ValidCode";
import {useSafeState} from "ahooks";
import {loginHandle} from "../../libs/request/login";
import {useLocalStorage} from "../../libs/lib";
import {useNavigate} from "react-router-dom";
import {storeRole} from "../../libs/lib";
import {useHookstate} from "@hookstate/core";

const logo = require("../../assets/1eb74873377d87adacc93c96141188c.png");


const {Content, Sider} = Layout;
const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};


const LockOutlined = () => null;
// eslint-disable-next-line require-jsdoc
function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i=0; i<vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] === variable) {return pair[1];}
  }
}

LockOutlined.propTypes = {className: PropTypes.string};


export const Login = () => {
  const store = useHookstate(storeRole);
  let [code, setCode] = useSafeState(null);
  // const onReset = () => {
  //     formRef.current?.resetFields();
  // };
  // const onFill = () => {
  //     formRef.current?.setFieldsValue({
  //         note: 'Hello world!',
  //         gender: 'male',
  //     });
  // };
  const [state, setState] = useSafeState(false);
  const validRef = React.createRef();
  const [loginName, setLoginName] = useSafeState("");
  const [password, setPassword] = useSafeState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const useLocal = useLocalStorage();
  const handleValidCodeChange = function(values) {
    setCode(values.join(""));
  };
  const handleOnSubmit = async function(event) {
    setState(true);
    form.validateFields().then(async (r)=>{
      const data = await loginHandle({
        loginName,
        password
      });
      useLocal.info = data;
      store.set(data.dataType);
      if (getQueryVariable("url")) {
        navigate(-1);
      } else {
        navigate("/");
      }
    }).catch((e)=>{console.log(e);});
    setTimeout(()=>{
      setState(false);
    }, 1500);
  };
  const handleCodeValidator = async function(_, val) {
    if (val === code) {
      return Promise.resolve(true);
    }
    validRef.current?.onRefresh?.();
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject( val?.length<1 || val === undefined? null:"验证码不正确");
  };
  return (
    <div className="login-wrapper">
      <Layout>
        <HeaderBar hideUser/>
        <Content className="login-container">
          <div className="login-content">
            <Layout style={{height: 420}} className="login-form-container">
              <Sider width={250}>
                <div className="login-logo">
                  {/* eslint-disable-next-line max-len */}
                  {/* <div className="base-item-title login-title"><i>惠州市新一代工业互联网研究院</i></div>*/}
                  <img src={logo} alt={"logo"}/>
                </div>
              </Sider>
              <Content className="login-form">
                <Form
                  name="normal_login"
                  {...layout}
                  form={form}
                  initialValues={{
                    remember: true
                  }}
                  onFinish={handleOnSubmit}
                  autoComplete="off"
                >
                  <Form.Item>
                    <h3 className="base-item-title login-text">请登录后使用</h3>
                  </Form.Item>
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "输入账号"
                      }
                    ]}
                  >
                    <Input prefix={<UserOutlined/>}
                      value = {
                        loginName
                      }
                      onInput={(event)=>setLoginName(event.target.value)}
                      placeholder="用户名"/>
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "输入密码"
                      }
                    ]}
                  >
                    <Input
                      prefix={<SecurityScanOutlined/>}
                      type="password"
                      placeholder="密码"
                      value = {
                        password
                      }
                      onInput={(event)=>setPassword(event.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "请填写验证码"
                      },
                      {
                        validateTrigger: "submit",
                        validator: handleCodeValidator
                      }
                    ]}
                    name={"valid"}
                  >
                    <div>
                      <Input
                        prefix={<FieldNumberOutlined/>}
                        type="text"
                        placeholder="验证码"
                        style={{width: "45%", alignSelf: "flex-end"}}
                      />
                      <ValidCode style={{float: "right"}}
                        onRef={validRef} total={4}
                        onChange={handleValidCodeChange}/>
                    </div>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      size={"middle"}
                      style={{width: 100}}
                      title={"登录系统"} type="primary"
                      htmlType="submit"
                      loading={state}
                      className="login-form-button">
                                                登录
                    </Button>
                  </Form.Item>
                </Form>

              </Content>
            </Layout>
          </div>
        </Content>
      </Layout>
    </div>
  );
};
