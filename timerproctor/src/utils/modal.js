import { Modal } from 'antd'

export const showModal = (type = 'error', title, content) => {
  Modal[type]({
    title: title,
    content: !content ? null : (
      <div>
        <p>
          { content }
        </p>
      </div>
    )
  })
}
