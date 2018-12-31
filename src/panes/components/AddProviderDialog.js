// Module imports
import {
  Consumer,
  Step,
  Wizard,
} from '@fuelrats/react-ratzard'
import React from 'react'





// Component imports
// import ChooseProviderType from './Wizards/ChooseProviderType'
import { addCustomProvider } from '../../modules/common'
import ChooseProviderType from './Wizards/ChooseProviderType'
import Dialog from './Dialog'
import ManualSSHSettings from './Wizards/CustomProvider/ManualSSHSettings'
import SetProviderName from './Wizards/SetProviderName'
import SSHSourcePicker from './Wizards/CustomProvider/SSHSourcePicker'





class AddProviderDialog extends React.Component {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  state = {
    name: '',
    settings: {
      sshSource: 'manual',
    },
    type: 'custom',
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _onSubmit = event => {
    const { onClose } = this.props
    const {
      name,
      settings,
      type,
    } = this.state

    event.preventDefault()

    switch (type) {
      case 'custom':
      default:
        addCustomProvider(name, settings)
        break
    }

    onClose()
  }

  _providerIsReady () {
    const {
      settings,
      type,
    } = this.state

    switch (type) {
      case 'custom':
      default:
        return AddProviderDialog._validateCustomProviderSettings(settings)
    }
  }

  _shouldShowDone () {
    const {
      settings,
      type,
    } = this.state

    if (!type) {
      return false
    }

    if ((type === 'custom') && !settings.sshSource) {
      return false
    }

    if (!this._providerIsReady()) {
      return false
    }

    return true
  }

  _updateSettings = newSettings => {
    this.setState(state => ({
      settings: {
        ...state.settings,
        ...newSettings,
      },
    }))
  }

  static _validateCustomProviderSettings (settings) {
    const requiredProps = ['host', 'path', 'port', 'url']
    const requiredPropsAreSet = requiredProps.every(setting => !!settings[setting])

    if (!requiredPropsAreSet) {
      return false
    }

    if (!settings.privateKey && !(settings.username && settings.password)) {
      return false
    }

    return true
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const { onClose } = this.props
    const {
      name,
      settings,
      type,
    } = this.state

    const controls = [
      AddProviderDialog.previousButton,
      this.nextButton,
      this.doneButton,
    ]

    return (
      <Wizard defaultStep="Manual SSH Settings">
      {/* <Wizard defaultStep="Choose Provider Type"> */}
        <Dialog
          controls={controls}
          onClose={onClose}
          title="Add a Provider">
          <form
            className="grid-system"
            onSubmit={this._onSubmit}
            ref={_formEl => this._formEl = _formEl}>
            {/* <Step
              id="Choose Provider Type"
              nextStep={() => ((type === 'custom') ? 'Choose SSH Source' : null)}>
              <ChooseProviderType
                onChange={value => this.setState({ type: value })}
                value={type} />
            </Step> */}

            {/* {!!type && (
              <Step
                id="Choose SSH Source"
                nextStep="Manual SSH Settings">
                <SSHSourcePicker
                  onChange={value => this._updateSettings({ sshSource: value })}
                  value={settings.sshSource} />
              </Step>
            )} */}

            {/* {(settings.sshSource === 'manual') && ( */}
            <Step
              id="Manual SSH Settings"
              nextStep="Provider Name">
              <ManualSSHSettings
                onChange={(key, value) => this._updateSettings({ [key]: value })}
                value={settings} />
            </Step>
            {/* )} */}

            <Step id="Provider Name">
              <SetProviderName
                onChange={value => this.setState({ name: value })}
                value={name} />
            </Step>
          </form>
        </Dialog>
      </Wizard>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get doneButton () {
    return (
      <Consumer
        data-menu-primary
        key="add-provider-dialog-done">
        {({ hasNextStep }) => {
          if (this._shouldShowDone() && !hasNextStep) {
            return (
              <button
                className="primary"
                disabled={!this._providerIsReady()}
                onClick={this._onSubmit}
                type="button">
                Done
              </button>
            )
          }

          return null
        }}
      </Consumer>
    )
  }

  get isValid () {
    const formEl = this._formEl
    let isValid = false

    if (formEl) {
      isValid = formEl.checkValidity()
    }

    return isValid
  }

  get nextButton () {
    return (
      <Consumer
        data-menu-primary
        key="add-provider-dialog-next">
        {({ hasNextStep, nextStep }) => {
          if (hasNextStep || !this._shouldShowDone()) {
            return (
              <button
                className="primary"
                disabled={!hasNextStep}
                onClick={nextStep}
                type="button">
                Next
              </button>
            )
          }

          return null
        }}
      </Consumer>
    )
  }

  static get previousButton () {
    return (
      <Consumer
        data-menu-secondary
        key="add-provider-dialog-previous">
        {({ hasPreviousStep, previousStep }) => {
          if (hasPreviousStep) {
            return (
              <button
                className="secondary"
                onClick={previousStep}
                type="button">
                Previous
              </button>
            )
          }

          return null
        }}
      </Consumer>
    )
  }
}





export default AddProviderDialog
