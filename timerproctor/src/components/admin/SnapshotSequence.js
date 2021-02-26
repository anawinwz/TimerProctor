import { useState, useEffect, useCallback, useRef } from 'react'
import styled from 'styled-components'
import { Image, Checkbox } from 'antd'
import { observer } from 'mobx-react-lite'
import useLockBodyWheel from '~/hooks/useLockBodyWheel'
import { dateStr } from '~/utils/date'

const Sequence = styled('div')`
  width: 100%;
  min-height: 60px;
  background: whitesmoke;
  overflow-y: hidden;
  overflow-x: auto;
  white-space: nowrap;
`

const Snapshot = styled('div')`
  position: relative;
  width: 20%;
  min-width: 80px;
  display: inline-block;
`

const SnapshotTimestamp = styled('span')`
  position: absolute;
  z-index: 1;
  left: 0px;
  bottom: 0px;
  width: 80%;
  width: fit-content;
  background: rgba(0, 0, 0,0.5);
  padding: 2px;
  color: white;
  font-size: 90%;
`

const SnapshotSequence = ({ snapshots = [] }) => {
  const [live, setLive] = useState(true)
  const [locked, setLock] = useLockBodyWheel()

  const sequence = useRef()
  useEffect(() => {
    if (live) {
      const elm = sequence.current
      if (elm) elm.scrollLeft = elm.scrollWidth - elm.clientWidth
    }
  }, [live, snapshots.length])

  const onLiveChanged = useCallback(e => setLive(e.target.checked))

  const onMouseEnter = useCallback(() => setLock(true), [])
  const onMouseLeave = useCallback(() => setLock(false), [])
  const onWheel = useCallback(e => {
    e.preventDefault()
    const elm = sequence.current
    elm.scrollTo({
      top: 0,
      left: elm.scrollLeft + e.deltaY
    })
  }, [])
  useEffect(() => sequence.current.addEventListener('wheel', onWheel, { passive: false }), [])

  return (
    <>
      <Checkbox onChange={onLiveChanged} checked={live}>เลื่อนไปหาภาพใหม่เสมอ</Checkbox>
      <Sequence ref={sequence} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <div>
          {snapshots.map(({ timestamp, url }) =>
            <Snapshot key={`snap_${timestamp}`}>
              <Image src={url} width="100%" />
              <SnapshotTimestamp>{ dateStr(timestamp, 'timeS') }</SnapshotTimestamp>
            </Snapshot>
          )}
        </div>
      </Sequence>
    </>
  )
}

export default observer(SnapshotSequence)
