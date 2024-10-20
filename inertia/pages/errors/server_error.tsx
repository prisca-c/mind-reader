interface Props {
  error: { message: string }
}

export default function ServerError(props: Props) {
  return (
    <>
      <div className='container'>
        <div className='title'>Server Error</div>

        <span>{props.error.message}</span>
      </div>
    </>
  )
}
