import { Toast } from "@/services/toast"

/** hàm xử lý các logic liên quan đến trang preview */
export function useAutoCreate() {
  const $toast = new Toast()

  /** hàm gửi sự kiện đến trang preview */
  function sendPreviewEvent(data: any) {
    /** dữ liệu gửi cho app chatbot Native */
    const DATA = JSON.stringify(data)
    // gửi dữ liệu cho app chatbot Native
    window.ReactNativeWebView?.postMessage(DATA)

    console.log('[App] Gửi sự kiện vào Frame:::', DATA)
  }

  function fakeEvent() {
    setTimeout(() => {
      document.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            type: 'AUTO_CREATE_NOTE',
            from: 'CHATBOT',
            data: {
              note: 'test',
              datetime: Date.now(),
            },
          }),
        })
      )
    }, 2000)
  }

  /** hàm lắng nghe sự kiện từ trang preview */
  function listenPreviewEvent(cb: Function) {
    window.addEventListener('message', (event: any) => {
      console.log('[App] Nhận event từ Frame:::', event.data)

      $toast.error(event.data)

      /** dữ liệu tự động tạo ghi chú được gửi từ app chatbot Native */
      const AUTO_CREATE_NOTE_EVENT = JSON.parse(event.data)

      // nếu sự kiện không phải là preview thì bỏ qua
      if (
        AUTO_CREATE_NOTE_EVENT.type !== 'AUTO_CREATE_NOTE' ||
        AUTO_CREATE_NOTE_EVENT.from !== 'CHATBOT'
      )
        return

      // gọi hàm callback truyền vào
      cb(AUTO_CREATE_NOTE_EVENT.data)
    })
  }

  return {
    fakeEvent,
    sendPreviewEvent,
    listenPreviewEvent,
  }
}
