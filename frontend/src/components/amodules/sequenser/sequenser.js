import React from "react"
import Tone from "tone"
import SeqDrum from "./seqDrum"
import SynthKey from "./synthKey"
import "./sequenser.scss"

class Sequenser extends React.Component {

state = {
  synth: [
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  ],
  drums: [
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
  ],
  activeBar: 0,
  bpm: 120,
}

componentDidMount() {
  Tone.Transport.cancel()
  this.soundGenerator()
  this.checkForActiveSession()
}

componentWillUnmount() {
  Tone.Transport.stop()
  sessionStorage.setItem("drums", JSON.stringify(this.state.drums))
}

checkForActiveSession = () => {
  if (sessionStorage.getItem("drums")) {
    this.setState({ drums: JSON.parse(sessionStorage.getItem("drums"))})
  }
}

startPlaying = () => {
  console.log("PLAYING")
  Tone.Transport.start("+0.1")
  // this.setState({ playing: true })
}

stopPlaying = () => {
  console.log("STOPPED")
  Tone.Transport.stop()
  // this.setState({ playing: false })
}

handleDrumClick = (drumIndex, barIndex) => {
  const newDrumMatrix = this.state.drums
  newDrumMatrix[drumIndex][barIndex] = !this.state.drums[drumIndex][barIndex]
  this.setState({
    drums: newDrumMatrix
  }, console.table(this.state.drums))
}

handleNoteClick = (synthKeyIndex, barIndex) => {
  const newSynthMatrix = this.state.synth
  newSynthMatrix[synthKeyIndex][barIndex] = !this.state.synth[synthKeyIndex][barIndex]
  this.setState({
    synth: newSynthMatrix
  }, console.table(this.state.synth))
}

handleBpmChange = e => {
  this.setState({
    bpm: e.target.value
  }, () => {
    console.log("STATE bpm: ", this.state.bpm)
    console.log("TRANSPORT bpm: ", Tone.Transport.bpm.value)
    Tone.Transport.bpm.value = this.state.bpm
  })
}

soundGenerator = () => {

  const gain = new Tone.Gain(0.6)
  gain.toMaster()

  // --------------------//
  //    DRUMS SECTION    //
  // --------------------//

  const drums = [
    new Tone.MembraneSynth(),
    new Tone.PluckSynth(
      {
        attackNoise: 2,
        dampening: 4000,
        resonance: 0.45
      }
    ),
    new Tone.MetalSynth(
      {
        frequency: 200,
        envelope: {
          attack: 0.001,
          decay: 0.05,
          release: 0.05
        },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5
      }
    )
  ]
  drums.forEach(drum => drum.connect(gain))

  drums[0].oscillator.type = "sine"
  // drums[1].oscillator.type = "sawtooth"
  // drums[2].oscillator.type = "sine"

  // --------------------//
  //    SYNTH SECTION    //
  // --------------------//

  const synths = []
  for (let i = 0; i < this.state.synth[0].length; i++) {
    synths.push(new Tone.Synth())
  }
  // new Tone.Synth(),
  // new Tone.Synth(),
  // new Tone.Synth(),
  // new Tone.Synth(),
  // new Tone.Synth(),
  // new Tone.Synth(),
  // new Tone.Synth(),
  // new Tone.Synth(),
  console.log("Synths: ", synths)

  synths.forEach(synth => synth.connect(gain))


  // --------------------//
  //      FX SECTION     //
  // --------------------//

  // FUTURE REVERBS AND FX SECTION
  // const freeverb = new Tone.Freeverb(0.02, 15000).toMaster();
  // gain.connect(freeverb)

  // const jcReverb = new Tone.JCReverb(0.02).toMaster();
  // gain.connect(jcReverb)

    // gain.toMaster()

  // -------------------- //
  //  TRANSPORT SECTION   //
  // -------------------- //

  let index = 0

  const drumNotes = ["C1", "C2", "C4"]

  const synthNotes = ["C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4"]

  Tone.Transport.bpm.value = this.state.bpm
  Tone.Transport.scheduleRepeat(time => {
    let step = index % 16
    this.setState({ activeBar: step })
    for (let i = 0; i < this.state.drums.length; i++) {
      if (this.state.drums[i][step]) {
        switch(i) {
          case 1:
            drums[i].triggerAttackRelease("C2", "16n", time)
            break
          case 2:
            drums[i].triggerAttackRelease("16n", time, 0.6)
            break
          default:
            drums[i].triggerAttackRelease(drumNotes[i], "8n", time)
        }
      }
    // }
    for (let i = 0; i < this.state.synth.length; i++) {
      if (this.state.synth[i][step]) {
          synths[i].triggerAttackRelease(synthNotes[i], "8n", time)
      }
    }
  }
    index++
}, "8n")

}

render() {
  const { blackKeys, synth, drums, activeBar, bpm } = this.state
  return (
    <div className="sequenser-container">
      <h3>SEQUENSER</h3>
      <div className="synth-container">
        <table>
          <thead>
            <tr>
              {synth[0].map((bars, index) => {
                return <th key={index} className={(index === activeBar) ?
                  "barIndicator barIndicator--active" :
                  "barIndicator"
                }>{index + 1}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {synth.map((synthKey, synthKeyIndex) => {
              return <SynthKey
                key={synthKeyIndex}
                synthKeyIndex={synthKeyIndex}
                bars={synth[synthKeyIndex]}
                synthKeyMatrix={synth}
                handleNoteClick={(barIndex) => this.handleNoteClick(synthKeyIndex, barIndex)}
              />
            })}
            </tbody>
        </table>
      </div>

      <div className="drums-container">
        <table>
          <thead>
            <tr>
              {drums[0].map((bars, index) => {
                return <th key={index} className={(index === activeBar) ?
                  "barIndicator barIndicator--active" :
                  "barIndicator"
                }>{index + 1}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {drums.map((drum, drumIndex) => {
              return <SeqDrum
                key={drumIndex}
                drumIndex={drumIndex}
                bars={drums[drumIndex]}
                drumMatrix={drums}
                handleDrumClick={(barIndex) => this.handleDrumClick(drumIndex, barIndex)}
              />
            })}
            </tbody>
        </table>
      </div>

      <div>
        <button onClick={this.startPlaying}>PLAY</button>
        <button onClick={this.stopPlaying}>STOP</button>
      </div>
      <div className="meters">
        <input
          name="bpm"
          type="range"
          min="40"
          max="300"
          value={bpm}
          onChange={this.handleBpmChange}
          />
        <label htmlFor="bpm">{this.state.bpm} BPM</label>
      </div>
    </div>
  )
}

}

export default Sequenser
