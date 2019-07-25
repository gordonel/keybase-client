import * as React from 'react'
import * as RouteTreeGen from '../../actions/route-tree-gen'
import * as TeamsGen from '../../actions/teams-gen'
import * as Container from '../../util/container'
import ReallyLeaveTeam, {Spinner, Props as RenderProps} from '.'
import LastOwnerDialog from './last-owner'
import {getCanPerform, hasCanPerform, leaveTeamWaitingKey} from '../../constants/teams'
import {Teamname} from '../../constants/types/teams'
import {anyWaiting} from '../../constants/waiting'

type OwnProps = Container.RouteProps<{teamname: string}>

type Props = {
  _canLeaveTeam: boolean
  _leaving: boolean
  _loadOperations: (teamname: Teamname) => void
  _loaded: boolean
} & RenderProps

class Switcher extends React.PureComponent<Props> {
  componentDidMount() {
    if (!this.props._loaded) {
      this.props._loadOperations(this.props.name)
    }
  }

  render() {
    if (!this.props._loaded) {
      return <Spinner {...this.props} />
    }
    if (!this.props._canLeaveTeam) {
      return <LastOwnerDialog {...this.props} />
    }
    return <ReallyLeaveTeam {...this.props} />
  }
}

export default Container.compose(
  Container.connect(
    (state, ownProps: OwnProps) => {
      const name = Container.getRouteProps(ownProps, 'teamname', '')
      const canPerform = getCanPerform(state, name)
      const _canLeaveTeam = canPerform.leaveTeam
      return {
        _canLeaveTeam,
        _leaving: anyWaiting(state, leaveTeamWaitingKey(name)),
        _loaded: hasCanPerform(state, name),
        name,
        title: 'Confirmation',
      }
    },
    (dispatch, ownProps: OwnProps) => ({
      _loadOperations: (teamname: string) => dispatch(TeamsGen.createGetTeamOperations({teamname})),
      onBack: () => dispatch(RouteTreeGen.createNavigateUp()),
      onLeave: () => {
        dispatch(
          TeamsGen.createLeaveTeam({
            context: 'chat',
            teamname: Container.getRouteProps(ownProps, 'teamname', ''),
          })
        )
      },
    }),
    (stateProps, dispatchProps, _: OwnProps) => {
      return {
        _canLeaveTeam: stateProps._canLeaveTeam,
        _leaving: stateProps._leaving,
        _loadOperations: dispatchProps._loadOperations,
        _loaded: stateProps._loaded,
        name: stateProps.name,
        onBack: stateProps._leaving ? () => {} : dispatchProps.onBack,
        onLeave: dispatchProps.onLeave,
        title: stateProps.title,
      }
    }
  ),
  Container.safeSubmit(['onLeave'], ['_leaving'])
)(Switcher)
