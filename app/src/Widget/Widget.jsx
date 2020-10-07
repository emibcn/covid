import React from 'react';

import { translate } from 'react-translate'

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import WidgetActions from './Actions';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
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

  // Get a shortcut to view's render function
  const View = sections.view.render;

  // Renders the view with a header containing the title and the menu with the rest of sections
  const Widget = (props) => {
    const classes = useStyles();
    // Prevent trigger actions components update when changing the day
    const { indexValues, ...restProps } = props;
    const action = <WidgetActions { ...restProps } sections={ sections } />;

    return (
      <Card className={classes.root}>
        <CardHeader
          action={ action }
          title={ sections.view.title(props)||props.name }
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
