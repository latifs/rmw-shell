import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import Icon from 'material-ui/Icon'
import Switch from 'material-ui/Switch'
import classNames from 'classnames'
import { withTheme, withStyles } from 'material-ui/styles'
import withAppConfigs from '../../withAppConfigs'
import { GoogleIcon, FacebookIcon, GitHubIcon, TwitterIcon } from '../../components/Icons';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  avatar: {
    margin: 10
  },
  bigAvatar: {
    width: 120,
    height: 120
  },
  margin: {
    margin: theme.spacing.unit
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3
  },
  root: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
})

class UserForm extends Component {


  isLinkedWithProvider = (provider) => {
    const { auth } = this.props;

    try {
      return auth && auth.providerData && auth.providerData.find((p) => { return p.providerId === provider }) !== undefined;
    } catch (e) {
      return false;
    }
  }

  getProviderIcon = (p) => {
    const { theme } = this.props
    const color = 'primary'

    switch (p) {
      case 'google.com':
        return <GoogleIcon />

      case 'facebook.com':
        return <FacebookIcon />

      case 'twitter.com':
        return <TwitterIcon />

      case 'github.com':
        return <GitHubIcon />

      default:
        return undefined
    }
  }


  render() {
    const {
      handleSubmit,
      intl,
      initialized,
      uid,
      handleAdminChange,
      isAdmin,
      photoURL,
      classes,
      appConfig,
      displayName,
      values
    } = this.props

    return (

      <div className={classes.root}>
        <Avatar
          alt={''}
          src={values.photoURL}
          className={classNames(classes.avatar, classes.bigAvatar)}
        />

        <div>
          {
            appConfig.firebase_providers.map((p, i) => {
              if (p !== 'email' && p !== 'password' && p !== 'phone') {
                return <IconButton
                  key={i}
                  disabled={!this.isLinkedWithProvider(p)}
                  color='primary'
                >
                  {this.getProviderIcon(p)}
                </IconButton>
              } else {
                return <div key={i} />
              }
            })
          }
        </div>
        <br />

        <Typography variant="display1" gutterBottom>
          {values.displayName}
        </Typography>

        <div>
          <FormControlLabel
            control={
              <Switch
                checked={isAdmin}
                onChange={handleAdminChange}
              />
            }
            label={intl.formatMessage({ id: 'is_admin_label' })}
          />

        </div>
      </div>

    )
  }
}

UserForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleAdminChange: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  initialized: PropTypes.bool.isRequired,
  uid: PropTypes.string.isRequired
}

export default withAppConfigs(withStyles(styles, { withTheme: true })(UserForm))
