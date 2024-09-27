import { Container } from '~/features/utils/components/container'

export const Footer = () => {
  return (
    <Container containerType="footer" className={'bg-gray-100 text-center h-12 w-full'}>
      <div className="flex justify-center items-center gap-2 h-6">
        <a href={'https://github.com/prisca-c/mind-reader'} target={'_blank'} rel={'noreferrer'}>
          <img src={'/images/github.svg'} alt={'GitHub logo'} className={'v-middle h-6 w-auto'} />
        </a>
        <a href={'https://ko-fi.com/nheira'} target={'_blank'} rel={'noreferrer'}>
          <img
            src={'/images/ko_fi_logo.svg'}
            alt={'Ko-fi logo'}
            className={'v-middle h-6 w-auto'}
          />
        </a>
      </div>
    </Container>
  )
}
