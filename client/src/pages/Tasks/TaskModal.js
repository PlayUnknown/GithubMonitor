import React from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import { formatMessage } from 'umi/locale';

const FormItem = Form.Item;
const { TextArea } = Input;

class TaskModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  showModalHandler = e => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  okHandler = () => {
    const { onOk, form, data } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (!data) {
          onOk(values);
        } else {
          onOk(data.id, values);
        }
        form.resetFields();
        this.hideModalHandler();
      }
    });
  };

  hideModalHandler = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible } = this.state;
    const { children, form, data = {} } = this.props;
    const {
      name = '',
      keywords = '',
      ignore_org: ignoreOrg = '',
      ignore_repo: ignoreRepo = '',
      mail = '',
      pages = 5,
      interval = 60,
    } = data;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <span>
        <span onClick={this.showModalHandler}>{children}</span>
        <Modal
          title={
            data
              ? formatMessage({ id: 'task.modal.edit-task' })
              : formatMessage({ id: 'task.modal.create-task' })
          }
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModalHandler}
          style={{ top: 20 }}
        >
          <Form layout="horizontal">
            <FormItem
              {...formItemLayout}
              label={formatMessage({ id: 'task.modal.field.task-name' })}
            >
              {getFieldDecorator('name', {
                initialValue: name,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'task.modal.field.task-name.required' }),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={formatMessage({ id: 'task.modal.field.keyword' })}
              help={formatMessage({ id: 'task.modal.field.keyword.hint' })}
            >
              {getFieldDecorator('keywords', {
                initialValue: keywords,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<TextArea rows={4} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={formatMessage({ id: 'task.modal.field.ignore-username' })}
              help='忽略指定账号下的仓库, 支持多个账号名使用换行分隔, 如cobo'
            >
              {getFieldDecorator('ignore_org', {
                initialValue: ignoreOrg,
              })(<TextArea rows={3} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={formatMessage({ id: 'task.modal.field.ignore-repo' })}
              help={formatMessage({ id: 'task.modal.field.ignore-repo.hint' })}
            >
              {getFieldDecorator('ignore_repo', {
                initialValue: ignoreRepo,
              })(<TextArea rows={3} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={formatMessage({ id: 'task.modal.field.email' })}
              help={formatMessage({ id: 'task.modal.field.email.hint' })}
            >
              {getFieldDecorator('mail', {
                initialValue: mail,
              })(<Input />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={formatMessage({ id: 'task.modal.field.crawl-pages' })}
              help={formatMessage({ id: 'task.modal.field.crawl-pages.hint' })}
            >
              {getFieldDecorator('pages', {
                initialValue: pages,
              })(<InputNumber min={0} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={formatMessage({ id: 'task.modal.field.crawl-interval' })}
              help={formatMessage({ id: 'task.modal.field.crawl-interval.hint' })}
            >
              {getFieldDecorator('interval', {
                initialValue: interval,
              })(<InputNumber min={0} />)}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(TaskModal);
