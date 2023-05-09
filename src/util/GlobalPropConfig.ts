import {message, Modal} from "ant-design-vue";
import {ModalFunc} from "ant-design-vue/lib/modal/Modal";
import {MessageApi} from "ant-design-vue/lib/message";

class Dlg {
    public static error(msg: string) {
        Modal.error({
            title: "错误",
            content: msg
        })
    }

    public static info(msg: string) {
        Modal.info({
            title: "提示",
            content: msg
        })
    }

    public static confirm(): ModalFunc {
        return Modal.confirm
    }

    public static message(): MessageApi {
        return message
    }
}

export function config(app: any) {
    app.config.globalProperties.$dlg = Dlg
}


