import React from 'react'
import PropTypes from 'prop-types'

import { translate } from 'react-translate'

import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'

import ErrorCatcher from '../ErrorCatcher'
import WidgetActions from './Actions'
import Remove, { RemovePropTypes, Icon as RemoveIcon } from './Remove'
import DragHandleWithIndicatorIcon from './DragHandleWithIndicatorIcon'

const useStyles = makeStyles({
  root: {
    height: '100%'
  },
  draggableWidgetTitle: {
    color: 'rgba(0, 0, 0, 0.54)',
    verticalAlign: 'middle',
    paddingRight: '.1em',
    '&:hover': {
      cursor: 'move'
    }
  }
})

const removeSection = {
  icon: RemoveIcon,
  label: ({ t }) => t('Remove'),
  title: ({ t }) => t('Remove?'),
  render: Remove
}

const ViewPropTypes = {
  t: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
}
const WidgetPropTypes = {
  indexValues: PropTypes.number.isRequired,
  ...ViewPropTypes,
  ...RemovePropTypes
}

// HOC to create widgets easily
const withWidget = (sectionsOrig) => {
  // Add always available `Remove` action
  const sections = {
    ...sectionsOrig,
    remove: removeSection
  }

  // Get a shortcut to view's render and title functions and
  // wrap these with an error catcher
  const {
    view: { render: ViewUnhandled, title: TitleUnhandled }
  } = sections
  function View (props) {
    const { t, name } = props
    return (
      <ErrorCatcher
        reloadOnRetry={false}
        origin={`${t('View Widget')} ${TitleUnhandled?.(props) ?? name}`}
      >
        <ViewUnhandled {...props} />
      </ErrorCatcher>
    )
  }

  View.propTypes = ViewPropTypes

  function Title (props) {
    const { t, name } = props
    return (
      <ErrorCatcher
        reloadOnRetry={false}
        origin={`${t('Title Widget')} ${name}`}
      >
        <TitleUnhandled {...props} />
      </ErrorCatcher>
    )
  }

  Title.propTypes = ViewPropTypes

  // Renders the view with a header containing the title and the menu with the rest of sections
  function Widget (props) {
    const classes = useStyles()
    // Prevent trigger actions components update when changing the day in slider
    // indexValues will not be passed using restProps
    // eslint-disable-next-line no-unused-vars
    const { indexValues: _, ...restProps } = props
    const action = <WidgetActions {...restProps} sections={sections} />
    const title = (
      <>
        <DragHandleWithIndicatorIcon classes={classes} />
        <Title {...props} />
      </>
    )
    return (
      <Card className={classes.root}>
        <CardHeader action={action} title={title} subheader={props.subtitle} />
        <CardContent>
          <View {...props} />
        </CardContent>
      </Card>
    )
  }

  Widget.propTypes = WidgetPropTypes

  return translate('Widget')(Widget)
}

export default withWidget
