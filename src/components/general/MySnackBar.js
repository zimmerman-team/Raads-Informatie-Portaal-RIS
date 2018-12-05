import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { setSnackBar } from '../../actions/generalActions';
import { setAgendaItemModal } from '../../actions/publisherActions';

class MySnackBar extends React.Component {
  render() {
    const classes = cx('global-snackbar', !this.props.open && 'close', this.props.type);
    const content = this.props.action ? (
      <div className="global-snackbar-content">
        <div>{this.props.message}</div>
        <Link
          to={`/evenement/${this.props.action.id}`}
          onClick={() => {
            const that = this;
            this.props.setSnackBar('');
            setTimeout(() => that.props.setAgendaItemModal(true), 400);
          }}
        >
          Voeg nu de agenda items toe
        </Link>
      </div>
    ) : (
      this.props.message
    );
    const autoHideDuration = !this.props.action ? { autoHideDuration: 4000 } : {};
    return (
      <Snackbar
        className={classes}
        open={this.props.open}
        {...autoHideDuration}
        message={content}
        onClose={() => this.props.setSnackBar('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    );
  }
}

function mapStateToProps(state) {
  const { snackbar } = state;
  return {
    open: snackbar.visibility,
    message: snackbar.message,
    type: snackbar.type,
    action: snackbar.action,
  };
}

export default connect(mapStateToProps, {
  setSnackBar,
  setAgendaItemModal,
})(MySnackBar);
