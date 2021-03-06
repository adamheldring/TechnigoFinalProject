import React from "react"
import "./settings.scss"
import "./pressRadioButtons.scss"
import "./customRangeInput.scss"

class Settings extends React.Component {

  handleBpmChange = e => {
    this.props.changeBpm(e.target.value)
  }

  handleWaveChange = e => {
    this.props.changeWaveForm(e.target.value)
  }

  render() {
    const { bpm, synthWaveForm } = this.props
    return (
      <section className="settings-container">
        <h2 className="composerPage-headline">SETTINGS</h2>
        <div className="settings-container__bpm">
          <h3 className="section-heading">TEMPO: <span className="highlighted">{this.props.bpm}</span> BPM</h3>
        </div>
        <div className="meters">
          <input
            name="bpm"
            type="range"
            min="40"
            max="300"
            value={bpm}
            onChange={this.handleBpmChange} />
        </div>

        <div className="waveFormSetting-container">
          <div className="settings-container__waveform">
            <h3 className="section-heading section-heading--waveform">WAVEFORM: <span className="highlighted">{this.props.synthWaveForm.toUpperCase()}</span></h3>
          </div>
          <label className="radio-button-container" htmlFor="triangle">
            <img src="./assets/wf-triangle-small.png" className="waveform-image" alt="triangle-waveform" />
            <input
              type="radio"
              id="triangle"
              name="triangle"
              value="triangle"
              onChange={this.handleWaveChange}
              checked={synthWaveForm === "triangle"} />
            <span className="custom-radio-button" />
          </label>
          <br />
          <label className="radio-button-container" htmlFor="square">
            <img src="./assets/wf-square-small.png" className="waveform-image" alt="square-waveform" />
            <input
              type="radio"
              id="square"
              name="square"
              value="square"
              onChange={this.handleWaveChange}
              checked={synthWaveForm === "square"} />
            <span className="custom-radio-button" />
          </label>
          <br />
          <label className="radio-button-container" htmlFor="sawtooth">
            <img src="./assets/wf-sawtooth-small.png" className="waveform-image" alt="sawtooth-waveform" />
            <input
              type="radio"
              id="sawtooth"
              name="sawtooth"
              value="sawtooth"
              onChange={this.handleWaveChange}
              checked={synthWaveForm === "sawtooth"} />
            <span className="custom-radio-button" />
          </label>
          <br />
          <label className="radio-button-container" htmlFor="sine">
            <img src="./assets/wf-sine-small.png" className="waveform-image" alt="sine-waveform" />
            <input
              type="radio"
              id="sine"
              name="sine"
              value="sine"
              onChange={this.handleWaveChange}
              checked={synthWaveForm === "sine"} />
            <span className="custom-radio-button" />
          </label>
          <br />
        </div>
      </section>
    )
  }

}

export default Settings
