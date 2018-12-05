import React from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { createQuery } from '../../actions/userActions';
import { setQueryModal } from '../../actions/generalActions';

class QueryModal extends React.Component {
  render() {
    const { tab, page, open, sortBy, filters, setQueryModal, createQuery } = this.props;
    const _filters = filters.map(f => {
      return {
        value: f.value,
        type: f.type,
        label: f.label,
        id: f.id,
      };
    });
    const actions = [
      <FlatButton label="Annuleren" primary onClick={setQueryModal} />,
      <FlatButton
        id="search-query-submit-btn"
        label="Bewaren"
        primary
        onClick={() => {
          createQuery({
            title: this.refs.title.getInputNode().value,
            filters: _filters,
            sort_by: sortBy.includes('ordering=') ? sortBy : `ordering=${sortBy}`,
            page,
            tab,
          });
        }}
      />,
    ];
    return (
      <Dialog
        open={open}
        modal={false}
        actions={actions}
        onRequestClose={setQueryModal}
        titleStyle={{ color: 'white', fontWeight: 900 }}
        title={<div className="filters-modal-header">BEWAAR EEN NIEUWE ZOEKOPDRACHT</div>}
      >
        <TextField
          id="search-query-input"
          hintText="Titel *"
          floatingLabelText="Titel"
          fullWidth
          ref="title"
        />
      </Dialog>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { tab, page, sortBy, filters, queryModal } = state;
  return {
    tab,
    page,
    sortBy,
    filters,
    open: queryModal.visibility,
  };
}

export default connect(mapStateToProps, {
  createQuery,
  setQueryModal,
})(QueryModal);
