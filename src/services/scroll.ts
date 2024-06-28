import { Ref } from 'vue'

/** hàm lấy phần tử cha có khả năng scroll gần nhất */
function getScrollParent(
  /** thẻ cần check có khả năng scroll */
  node: Element | null,
  /** thẻ bọc ngoài */
  until = document.body
): Element | null {
  // khi thẻ cần check có khả năng scroll bằng thẻ bọc ngoài thì dừng lại
  if (!node || node === until) {
    return null
  }

  //hàm lấy giá trị của style nào đó
  const style = (value: Element, prop: string) =>
    getComputedStyle(value, null).getPropertyValue(prop)

  const regex = /(auto|scroll)/

  // check xem thẻ hiện tại có khả năng scroll hay không
  const scroll = regex.test(
    style(node, 'overflow') +
      style(node, 'overflow-y') +
      style(node, 'overflow-x')
  )
  // nếu có khả năng scroll thì trả về chính nó
  //không thì sẽ đệ quy với phần tử cha của nó
  return scroll ? node : getScrollParent(node.parentElement, until)
}

/** hàm scroll tới 1 phần tử đã chọn */
function scrollTo(element: Element, to: number, duration = 0) {
  // nhảy trực tiếp tới nếu duration = 0
  if (duration <= 0) {
    requestAnimationFrame(() => {
      element.scrollTop = to
    })
    return
  }
  // chia khoảng cách cần scroll tới thành 10 phần và thực hiện với mỗi lần qu
  const difference = to - element.scrollTop
  const tick = (difference / duration) * 10
  requestAnimationFrame(() => {
    const scrollTop = element.scrollTop + tick
    if (scrollTop >= to) {
      element.scrollTop = to
      return
    }
    element.scrollTop = scrollTop
    scrollTo(element, to, duration - 10)
  })
}

/** hàm scroll tới các phần tử đã chọn */
export function scrollToSelected(
  /** thời gian scroll */
  duration: number,
  /** phần tử bọc ngoài cùng */
  time_picker: Ref<HTMLElement | undefined>
) {
  // lấy ra các phần từ cần scroll tới
  const elements = time_picker.value?.querySelectorAll('.active')
  if (!elements) return
  // lặp qua tên phần tử gần scroll tới
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i] as HTMLElement
    // lắy phần tử cha gần nhất có thể scroll
    const scrollElement = getScrollParent(element, time_picker.value)
    if (scrollElement) {
      // lấy chiều cao cần scroll
      // 37 là chiều cao của ngày đã chọn ở phía trên
      const to = element.offsetTop - 37
      scrollTo(scrollElement, to, duration)
    }
  }
}
