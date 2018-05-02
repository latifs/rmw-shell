import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withTheme, withStyles } from 'material-ui/styles'
import { injectIntl, intlShape } from 'react-intl'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import Icon from 'material-ui/Icon'
import { withRouter } from 'react-router-dom'
import { withFirebase } from 'firekit-provider'
import ReactList from 'react-list'
import { FilterDrawer, filterSelectors, filterActions } from 'material-ui-filter'
import { GoogleIcon, FacebookIcon, GitHubIcon, TwitterIcon } from '../../components/Icons'
import Activity from '../../components/Activity'
import Scrollbar from '../../components/Scrollbar'
import SearchField from '../../components/SearchField'
//import { ResponsiveMenu } from 'material-ui-responsive-menu'
import { getList, isLoading } from 'firekit'
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip'

const path = `users`

export class Users extends Component {

  componentDidMount() {
    const { watchList } = this.props;

    watchList(path)
  }

  getProviderIcon = (provider) => {
    const { theme } = this.props;
    const color = 'primary';

    switch (provider.providerId) {
      case 'google.com':
        return <GoogleIcon color={color} />
      case 'facebook.com':
        return <FacebookIcon color={color} />
      case 'twitter.com':
        return <TwitterIcon color={color} />
      case 'github.com':
        return <GitHubIcon color={color} />
      case 'phone':
        return <Icon color={color} >phone</Icon>
      case 'password':
        return <Icon color={color} >email</Icon>
      default:
        return undefined
    }
  }

  handleRowClick = (user) => {
    const { history, isSelecting } = this.props
    history.push(isSelecting ? `/${isSelecting}/${user.key}` : `/${path}/edit/${user.key}/profile`)
  }


  renderItem = (index, key) => {
    const { list, intl, theme } = this.props
    const user = list[index].val

    return <div key={key}>

      <ListItem
        key={key}
        onClick={() => { this.handleRowClick(list[index]) }}
        id={key}>
        {user.photoURL && <Avatar src={user.photoURL} alt='person' />}
        {!user.photoURL && <Avatar> <Icon > person </Icon>  </Avatar>}
        <ListItemText primary={user.displayName} secondary={(!user.connections && !user.lastOnline) ? intl.formatMessage({ id: 'offline' }) : intl.formatMessage({ id: 'online' })} />

        <Toolbar >
          {user.providerData && user.providerData.map(
            (p, i) => {
              return (
                <div key={i} >
                  {this.getProviderIcon(p)}
                </div>
              )
            })
          }
        </Toolbar>
        <Icon color={user.connections ? 'primary' : 'disabled'}>offline_pin</Icon>
      </ListItem>
      <Divider inset={true} />
    </div>

  }

  render() {
    const {
      list,
      theme,
      setSearch,
      intl,
      setFilterIsOpen,
      hasFilters,
      isLoading
    } = this.props

    const menuList = [
      {
        text: intl.formatMessage({ id: 'open_filter' }),
        icon: <Icon className="material-icons" color={hasFilters ? theme.palette.accent1Color : theme.palette.canvasColor}>filter_list</Icon>,
        tooltip: intl.formatMessage({ id: 'open_filter' }),
        onClick: () => { setFilterIsOpen('users', true) }
      }
    ]

    const filterFields = [
      {
        name: 'displayName',
        label: intl.formatMessage({ id: 'name' })
      },
      {
        name: 'creationTime',
        type: 'date',
        label: intl.formatMessage({ id: 'creation_time' })
      }
    ];

    return (
      <Activity
        title={'test'}
        appBarContent={
          <div style={{ display: 'flex' }}>

            <SearchField
              filterName={'users'}
            />


            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => { setFilterIsOpen('users', true) }}
            >
              <Icon className="material-icons" color={hasFilters ? theme.palette.accent1Color : theme.palette.canvasColor}>filter_list</Icon>
            </IconButton>

          </div>
        }

        iconStyleLeft={{ width: 'auto' }}
        iconStyleRight={{ width: '100%', textAlign: 'center', marginLeft: 0 }}
        iconElementRight={
          <div style={{ display: 'flex' }}>
            <div style={{ width: 'calc(100% - 84px)' }}>
              <SearchField
                filterName={'users'}
                hintText={`${intl.formatMessage({ id: 'search' })}`}
              />
            </div>
            <div style={{ position: 'absolute', right: 10, width: 100 }}>

            </div>
          </div>
        }
        isLoading={isLoading}>
        <div style={{ height: '100%', overflow: 'none', backgroundColor: theme.palette.canvasColor }}>
          <Scrollbar>
            <List id='test' ref={field => this.list = field}>
              <ReactList
                itemRenderer={this.renderItem}
                length={list ? list.length : 0}
                type='simple'
              />
            </List>
          </Scrollbar>
        </div>
        <FilterDrawer
          name={'users'}
          fields={filterFields}
        //formatMessage={intl.formatMessage}
        />
      </Activity>
    )
  }
}

Users.propTypes = {
  users: PropTypes.array,
  intl: intlShape.isRequired,
  theme: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  const { lists, auth, filters } = state
  const { match } = ownProps

  const isSelecting = match.params.select ? match.params.select : false

  const { hasFilters } = filterSelectors.selectFilterProps('users', filters)
  const list = filterSelectors.getFilteredList('users', filters, getList(state, path), fieldValue => fieldValue.val)

  return {
    isSelecting,
    hasFilters,
    isLoading: isLoading(state, path),
    list,
    auth
  }
}


export default connect(
  mapStateToProps, { ...filterActions }
)(injectIntl(withTheme()(withFirebase(withRouter(Users)))));
