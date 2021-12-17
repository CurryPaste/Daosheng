/**
 * 消息弹框封装
 */

import { Modal } from "ant-design-vue";

/**
 * 异步消息确认框
 * 调用方式-参数调用，OK的loading会等待promiseMethod执行后关闭。promiseMethod出现异常时，会关闭ok-loading
 * @param content 主题内容
 * @param promiseMethod ok时执行的异步函数
 * @param catchMethod promiseMethod异常回调
 * @param opt Modal-confirm 配置项
 * @returns void
 */
export const promiseConfirm = (
  content: string,
  promiseMethod: () => Promise<void>,
  opt = {
    okText: () => "确定",
    cancelText: () => "取消",
  },
  catchMethod?: () => void,
) => {
  const modal = Modal.confirm({
    ...opt,
    content: () => content,
    onOk: () =>
      new Promise<void>((resolve, reject) => {
        promiseMethod()
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
            modal.destroy();
            if (catchMethod) catchMethod();
          });
      }),
  });
};

export default {};
