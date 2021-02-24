import { useState, useEffect, useCallback, useRef } from 'react'
import styled from 'styled-components'
import { Image, Checkbox } from 'antd'
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

  const sequence = useRef()
  useEffect(() => {
    if (live) {
      const elm = sequence.current
      if (elm) elm.scrollLeft = elm.scrollWidth - elm.clientWidth
    }
  }, [live, snapshots.length])

  const onLiveChanged = useCallback(e => setLive(e.target.checked))

  return (
    <>
      <Checkbox onChange={onLiveChanged} checked={live}>เลื่อนไปหาภาพใหม่เสมอ</Checkbox>
      <Sequence ref={sequence}>
        <div>
          {snapshots.map(({ timestamp, url }) =>
            <Snapshot>
              <Image src={url} width="100%" />
              <SnapshotTimestamp>{ dateStr(timestamp, 'timeS') }</SnapshotTimestamp>
            </Snapshot>
          )}
        </div>
      </Sequence>
    </>
  )
}

export default SnapshotSequence
