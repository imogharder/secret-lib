export const Toast = ({ toast }) => {
  if (!toast) return null
  return (
    <div className={`toast ${toast.type}`}>
      {toast.type === 'success' && '✓ '}
      {toast.type === 'error' && '✕ '}
      {toast.msg}
    </div>
  )
}
