import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import Root from './containers/Root'
import AppConfigProvider from 'rmw-core'
import config from './config'
import locales, { addLocalizationData } from './locales'

addLocalizationData(locales)

class App extends Component {
  render() {
    const { appConfig } = this.props

    const store = appConfig.configureStore()

    const configs = { ...config, ...appConfig }

    return (
      <Provider store={store}>
        <AppConfigProvider appConfig={configs}>
          <Root appConfig={configs} />
        </AppConfigProvider>
      </Provider>
    )
  }
}

App.propTypes = {
  appConfig: PropTypes.object.isRequired
}

export default App
