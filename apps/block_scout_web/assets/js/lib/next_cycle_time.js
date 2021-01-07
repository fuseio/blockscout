import $ from 'jquery'
import { getCurrentCycleBlocks, getCycleEnd } from './smart_contract/consensus'
import { secondsToDhms, calcCycleLength } from './fuse_utils'

function appendTime (time) {
  $('[data-selector="cycle-end"]').empty().append(secondsToDhms(time))
}

$(async function () {
  let time
  let [cycleStartBlock, cycleEndBlock] = await getCurrentCycleBlocks()
  let cycleEndInSeconds = await getCycleEnd()
  const cycleLength = calcCycleLength(cycleStartBlock, cycleEndBlock)

  function updateCycleTime () {
    if (!time) {
      time = cycleEndInSeconds
      appendTime(time)
    } else {
      if (cycleEndInSeconds > 0) {
        time = --cycleEndInSeconds
        appendTime(time)
      } else {
        // when cycle is done, begin cycle from beginning
        cycleEndInSeconds = cycleLength
        time = cycleEndInSeconds
        appendTime(time)
      }
    }
  }

  setInterval(updateCycleTime, 1000)
})