import React from 'react';
import { Modal, Form, Icon, Input } from 'antd';

const FormItem = Form.Item;

const styles={
    error: {position:"absolute", top:"28px", left:0, color:"red"},
    submiterror: {position:"absolute", top:"42px", left:0, color:"red"},
    reset: {position:"absolute", top:"88px", left:"55%", cursor:"pointer"}
}

class NormalLoginForm extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let {userError, pwdError, repPwdError, userValid, pwdValid, repPwdValid, userValue, pwdValue, repPwdValue, 
          handleReset, handleChange, field,
          validate, errMsg, submitType}=this.props;
        return (
            <Form>
                <FormItem>
                    <Input value={userValue}
                        prefix={<Icon type="user" style={{fontSize:13}} />} placeholder="Username" 
                        onChange={(e)=>handleChange( "user", e.target.value)}
                    />
                    {!userValid && <a href="javascript:;" style={styles.error}>{userError}</a>}
                </FormItem>
                <FormItem>
                    <Input value={pwdValue}
                        prefix={<Icon type="lock" style={{fontSize:13}} />} type="password" placeholder="Password" 
                        onChange={(e)=>handleChange( "pwd", e.target.value)}
                    />
                    {!pwdValid && <span style={styles.error}>{pwdError}</span>}
                    {!validate && submitType==="loginsubmit" && <span style={styles.submiterror}>{errMsg}</span>}
                    {field==="login" && <span style={styles.reset} onClick={handleReset}>忘记了密码？</span>}
                </FormItem>
                {
                  field==="regist"?
                  <FormItem>
                      <Input value={repPwdValue} 
                          prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Repeat Password" 
                          onChange={(e)=>handleChange( "repPwd", e.target.value)}
                      />
                      {!repPwdValid && <span style={styles.error}>{repPwdError}</span>}
                      {!validate && <span style={styles.submiterror}>{errMsg}</span>}
                  </FormItem> : null
                }
            </Form>
        )
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default class LoginRegistComp extends React.Component {
  render() {
    const { 
      title, 
      visible, 
      confirmLoading, 
      handleSubmit, 
      handleCancel 
    } = this.props;
    return (
      <Modal title={title}          
        visible={visible}
        onOk={handleSubmit}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <WrappedNormalLoginForm {...this.props} />
      </Modal>
    );
  }
}



