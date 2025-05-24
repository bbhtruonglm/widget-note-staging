/** hàm xử lý các logic liên quan đến trang preview */
export function useAutoCreate() {
  /** hàm gửi sự kiện đến trang preview */
  function sendPreviewEvent(data: any) {
    window.parent.postMessage(
      {
        type: 'AUTO_CREATE_NOTE',
        from: 'WIDGET_NOTE',
        data,
      },
      '*'
    )

    console.log('[App] Gửi sự kiện vào Frame:::', data)
  }

  function fakeEvent(){
    setTimeout(() => {
      window.parent.postMessage(
        {
          type: 'AUTO_CREATE_NOTE',
          from: 'CHATBOT',
          data:{
            note:'test',
            datetime: Date.now()
          },
        },
        '*'
      )
    }, 2000)
  }

  /** hàm lắng nghe sự kiện từ trang preview */
  function listenPreviewEvent(cb:Function) {
    window.addEventListener('message', event => {      
      console.log('[App] Nhận event từ Frame:::', event.data)

      // nếu sự kiện không phải là preview thì bỏ qua
      if (event.data.type !== 'AUTO_CREATE_NOTE' || event.data.from !== 'CHATBOT') return

      /** dữ liệu nhận được từ trang preview */
      const DATA = event.data.data

      // gọi hàm callback truyền vào
      cb(DATA)

      // gửi sự kiện success cho trang preview
      // sendPreviewEvent({
      //   type: 'get.data.success'
      // })
    })
  }

  return {
    fakeEvent,
    sendPreviewEvent,
    listenPreviewEvent
  }
}
