type IMap<K> = (v?: K, index?: number) => any

interface ILinkedNode<N> {
  element: N
  previous: ILinkedNode<N>
  next: ILinkedNode<N>
  index: number
}

const createNode = (element) => ({
  element,
  previous: null,
  next: null,
  index: 0
})

/** 双向非循环链表 */
class Chain<T> {
  head: ILinkedNode<T> = null
  tail: ILinkedNode<T> = null
  pointer: ILinkedNode<T>
  length: number = 0
  constructor(element: T) {
    const node = createNode(element)
    node.previous = null
    node.index = this.length
    this.tail = node
    this.pointer = node
    this.head = node
    this.length++
  }

  /**
   *
   * 同数组push
   */
  push(...data: T[]) {
    data.forEach((d, i) => {
      const node = createNode(d)
      node.previous = this.tail
      node.index = this.length
      this.tail = node
      this.pointer = node
      if (!this.head.next) {
        this.head.next = node
      }
      ++this.length
    })
    return this.length
  }

  /** 返回指定索引data， 并把pointer设置为index处 */

  at(index: number) {
    if (index < 0 || index >= this.length) {
      return false
    }
    let cur = this.head
    while (cur.index !== index) {
      cur = cur.next
    }
    this.pointer = cur
    return cur.element
  }

  /**
   * 删除指定节点后面的节点
   *
   */
  removeAfterPointer() {
    this.pointer.next = null
    this.length = this.pointer.index + 1
    this.tail = this.pointer
  }

  /** 同数组map */
  map(cb: IMap<T>) {
    let node = this.head
    const res = []
    while (node) {
      const v = cb(node.element, node.index)
      v !== false && res.push(v)
      node = node.next
    }
    return res
  }
}

export default Chain
