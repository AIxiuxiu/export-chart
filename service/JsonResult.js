/*
 * @Description: 返回统一封装
 * @Author: ahl
 * @Date: 2021-01-15 09:02:13
 * @LastEditTime: 2021-01-29 10:06:40
 */


class ResultCode {
    /**
     * code
     */
    code;
    /**
     * 说明
     */
    desc;

    constructor(code, desc) {
        this.code = code;
        this.desc = desc;
    }

    /************************************/

    static SUCCESS = new ResultCode(200, '请求成功');
    static FAILED = new ResultCode(500, '请求失败');
    static VALIDATE_FAILED = new ResultCode(400, '参数校验失败');
    static API_NOT_FOUNT = new ResultCode(404, '接口不存在');
    static API_BUSY = new ResultCode(700, '操作过于频繁')
}

/**
 * @description 统一返回结果
 */
class JsonResult {

    /**
     * 返回code
     */
    code;
    /**
     * 返回消息
     */
    msg;
    /**
     * 返回数据
     */
    data;
    /**
     * 返回时间
     */
    time;

    /**
     * 
     * @param code {number} 返回code
     * @param msg {string} 返回消息
     * @param data {any} 返回具体对象
     */
    constructor(code, msg, data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
        this.time = Date.now();
    }

    /**
     * 成功
     * @param data {any} 返回对象
     * @return {JsonResult}
     */
    static success(data) {
        return new JsonResult(ResultCode.SUCCESS.code, ResultCode.SUCCESS.desc, data);
    }

    /**
     * 失败
     */
    static fail(errData) {
        return new JsonResult(ResultCode.FAILED.code, ResultCode.FAILED.desc, errData);
    }

    /**
    * 失败
    */
    static failWithCode(code, message, errData) {
        return new JsonResult(code, message, errData);
    }

    /**
     * 参数校验失败
     */
    static validateFailed(param) {
        return new JsonResult(ResultCode.VALIDATE_FAILED.code, ResultCode.VALIDATE_FAILED.desc, param);
    }

    /**
     * 拦截到的业务异常
     * @param bizException {BizException} 业务异常
     */
    static bizFail(bizException) {
        return new JsonResult(bizException.code, bizException.msg, null);
    }

}

module.exports = JsonResult
