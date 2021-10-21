import React from 'react'
import PropTypes from 'prop-types'

import { translate } from 'react-translate'

import { SortableHandle } from 'react-sortable-hoc'

import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'

import Button from '@material-ui/core/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import WidgetActions from './Actions'
import ErrorCatcher from '../ErrorCatcher'

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

// Used to remove a widget from the Dashboard
function Remove ({ id, onRemove, t }) {
  const handleRemove = () => onRemove(id)
  return (
    <Button
      startIcon={<FontAwesomeIcon icon={faTrash} />}
      onClick={handleRemove}
      variant='contained'
      color='primary'
      aria-label={t('remove')}
    >
      {t('Confirm removal')}
    </Button>
  )
}

Remove.propTypes = {
  id: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}

const removeSection = {
  icon: <FontAwesomeIcon icon={faTrash} />,
  label: ({ t }) => t('Remove'),
  title: ({ t }) => t('Remove?'),
  render: Remove
}

// Used to sort the widget
function DragHandleInner ({ children }) {
  const classes = useStyles()
  return <span className={classes.draggableWidgetTitle}>{children}</span>
}

DragHandleInner.propTypes = {
  children: PropTypes.node
}

DragHandleInner.defaultProps = {
  children: <></>
}

const DragHandle = SortableHandle(DragHandleInner)

// Use an Icon to handle dragging
function DragHandleWithIndicatorIcon () {
  return (
    <DragHandle>
      <DragIndicatorIcon />
    </DragHandle>
  )
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

  // Renders the view with a header containing the title and the menu with the rest of sections
  const Widget = (props) => {
    const classes = useStyles()
    // Prevent trigger actions components update when changing the day in slider
    // indexValues will not be passed using restProps
    // eslint-disable-next-line no-unused-vars
    const { indexValues, ...restProps } = props
    const action = <WidgetActions {...restProps} sections={sections} />
    const title = (
      <>
        <DragHandleWithIndicatorIcon />
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

  return translate('Widget')(Widget)
}

export default withWidget
