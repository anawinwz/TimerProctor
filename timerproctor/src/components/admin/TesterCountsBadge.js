import WhiteBadge from '~/components/WhiteBadge'

const TesterCountsBadge = ({ count = 0, isNew = false }) => {
  return (
    <WhiteBadge
      count={count}
      overflowCount={999}
      showZero
      className={isNew ? 'new' : ''}
    />
  )
}

export default TesterCountsBadge
