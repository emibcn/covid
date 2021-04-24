import React from 'react';

import { translate } from 'react-translate'

import { SortableHandle } from 'react-sortable-hoc';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import WidgetActions from './Actions';
import ErrorCatcher from '../ErrorCatcher';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  draggableWidgetTitle: {
    color: 'rgba(0, 0, 0, 0.54)',
    verticalAlign: 'middle',
    paddingRight: '.1em',
    '&:hover': {
      cursor: 'move',
    },
  },
}));

// HOC to create widgets easily
const withWidget = (sectionsOrig) => {

  // Add always available `Remove` action
  const sections = {
    ...sectionsOrig,
    remove: {
      icon: <FontAwesomeIcon icon={ faTrash } />,
      label: ({ t }) => t("Remove"),
      title: ({ t }) => t("Remove?"),
      render: ({ id, onRemove, t }) => {
        const handleRemove = () => onRemove(id);
        return (
          <Button
            startIcon={ <FontAwesomeIcon icon={ faTrash } /> }
            onClick={ handleRemove }
            variant="contained"
            color="primary"
            aria-label={ t("remove") }
          >
            { t("Confirm removal") }
          </Button>
        )
      },
    },
  };

  // Get a shortcut to view's render function and
  // wrap that with an error catcher
  const ViewUnhandled = sections.view.render;
  const View = (props) => (
    <ErrorCatcher
      reloadOnRetry={ false }
      origin={`${props.t('View Widget')} ${sections.view.title(props)||props.name}`}
    >
      <ViewUnhandled { ...props } />
    </ErrorCatcher>
  );

  // Used to sort the widget
  const DragHandle = SortableHandle((props) => {
    const { children } = props;
    const classes = useStyles();
  
    return (
      <span className={classes.draggableWidgetTitle}>
        {children}
      </span>
    );
  })

  // Use an Icon to handle dragging
  const DragHandleWithIndicatorIcon = () => (
    <DragHandle><DragIndicatorIcon /></DragHandle>
  )

  // Get a shortcut to title's render function and
  // wrap that with an error catcher
  const TitleUnhandled = sections.view.title;
  const Title = (props) => (
    <ErrorCatcher
      reloadOnRetry={ false }
      origin={`${props.t('Title Widget')} ${props.name}`}
    >
      <TitleUnhandled { ...props } />
    </ErrorCatcher>
  );

  // Renders the view with a header containing the title and the menu with the rest of sections
  const Widget = (props) => {
    const classes = useStyles();
    // Prevent trigger actions components update when changing the day
    const { indexValues, ...restProps } = props;
    const action = <WidgetActions { ...restProps } sections={ sections } />;
    const title = <><DragHandleWithIndicatorIcon /><Title {...props} /></>;
    return (
      <Card className={classes.root}>
        <CardHeader
          action={ action }
          title={ title }
          subheader={ props.subtitle }
        />
        <CardContent>
          <View { ...props } />
        </CardContent>
      </Card>
    )
  };

  return translate('Widget')(Widget);
};

export default withWidget;
