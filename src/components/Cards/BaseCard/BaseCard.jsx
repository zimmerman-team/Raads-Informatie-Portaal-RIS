import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui-next/styles';
import cx from 'classnames';
import Card from 'material-ui-next/Card';
import CardHeader from 'material-ui-next/CardHeader';
import CardMedia from 'material-ui-next/CardMedia';
import CardContent from 'material-ui-next/CardContent';
import CardActions from 'material-ui-next/CardActions';
import Collapse from 'material-ui-next/Collapse';
import Avatar from 'material-ui-next/Avatar';
import IconButton from 'material-ui-next/IconButton';
// import Typography from 'material-ui-next/Typography';
import red from 'material-ui-next/colors/red';
// import FavoriteIcon from '@material-ui/icons/Favorite';
// import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import classes from './BaseCard.module.scss';

const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
});

class BaseCard extends React.Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    // const { classes } = this.props;

    return (
      <div>
        <Card className={classes.card} component="section">
          <CardHeader
            action={<IconButton>{/*<MoreVertIcon />*/}</IconButton>}
            title="Lorem Ipsum dolor"
            subheader="September 14, 2016"
            component="header"
          />
          <CardActions className={classes.actions} disableActionSpacing>
            <IconButton
              className={cx(classes.expand, {
                [classes.expandOpen]: this.state.expanded,
              })}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="Show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent />
          </Collapse>
        </Card>
      </div>
    );
  }
}

BaseCard.propTypes = {};

export default BaseCard;
