import React from 'react';
import Dialog from 'material-ui/Dialog';
import Button from '@material-ui/core/Button';
import FilterExpandableBlock from './FilterExpandableBlock';
import moment from 'moment';
import appResources from '../../appResources';
import _ from 'lodash';

const filtersObjects = [
  {
    name: 'Tijdsperiode',
    type: 'date',
    options: [
      { label: 'Vandaag', obj: { key: 0, label: 'Vandaag', value: [moment(), moment()] } },
      {
        label: 'Gisteren',
        obj: {
          key: 1,
          label: 'Gisteren',
          value: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        },
      },
      {
        label: 'Laatste 7 dagen',
        obj: { key: 2, label: 'Laatste 7 dagen', value: [moment().subtract(6, 'days'), moment()] },
      },
      {
        label: 'Laatste 30 dagen',
        obj: {
          key: 3,
          label: 'Laatste 30 dagen',
          value: [moment().subtract(29, 'days'), moment()],
        },
      },
      {
        label: 'Deze maand',
        obj: {
          key: 4,
          label: 'Deze maand',
          value: [moment().startOf('month'), moment().endOf('month')],
        },
      },
      {
        label: 'Vorige maand',
        obj: {
          key: 5,
          label: 'Vorige maand',
          value: [
            moment()
              .subtract(1, 'month')
              .startOf('month'),
            moment()
              .subtract(1, 'month')
              .endOf('month'),
          ],
        },
      },
      {
        label: 'Dit jaar',
        obj: {
          key: 7,
          label: 'Dit jaar',
          value: [moment([moment().get('year'), 0, 1]), moment([moment().get('year'), 11, 31])],
        },
      },
      {
        label: 'Aangepaste tijdsperiode',
        obj: { key: 6, label: 'Aangepaste tijdsperiode', value: 'custom_date_range' },
      },
    ],
  },
  {
    name: 'Type Raadsdocument',
    type: 'item_type',
    options: appResources.documentTypes,
  },
  {
    name: 'Beleidsthema',
    type: 'beleidsthema',
    options: [{ label: 'none', obj: { key: 0, value: '' } }],
  },
  {
    name: 'Onderwerp',
    type: 'Onderwerp',
    options: [{ label: 'none', obj: { key: 0, value: '' } }],
  },
  {
    name: 'Naam indiender',
    type: 'Naam indiender',
    options: [{ label: 'none', obj: { key: 0, value: '' } }],
  },
  {
    name: 'Politieke Partij',
    type: 'Politieke Partij',
    options: [{ label: 'none', obj: { key: 0, value: '' } }],
  },
  {
    name: 'Dossiers',
    type: 'Dossiers',
    options: [{ label: 'none', obj: { key: 0, value: '' } }],
  },
  {
    name: 'Notities & annotaties',
    type: 'Notities & annotaties',
    options: [{ label: 'none', obj: { key: 0, value: '' } }],
  },
  {
    name: 'Format',
    type: 'Format',
    options: [{ label: 'none', obj: { key: 0, value: '' } }],
  },
];

class FiltersModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialFilters: props.filters,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevProps.show && this.props.show) {
      this.setState({
        initialFilters: this.props.filters,
      });
    }
  }

  render() {
    const { initialFilters } = this.state;
    const {
      chips,
      filters,
      setFilter,
      show,
      close,
      resultsCount,
      keepInitialFilters,
      removeFilter,
    } = this.props;
    return (
      <Dialog
        open={show}
        bodyClassName="fullscreen--modal-body"
        contentClassName="fullscreen--modal-content"
        paperClassName="fullscreen--modal-paper"
        style={{ zIndex: 1999 }}
      >
        <div className="filters-modal-content">
          <h1>Raadsinformatie filters</h1>
          <div className="btns-div">
            <Button className="results-btn" onClick={close}>
              <b>{`Toon ${resultsCount} resultaten`}</b>
            </Button>
            <Button
              className="cancel-btn"
              onClick={() => {
                keepInitialFilters(initialFilters);
                close();
              }}
            >
              Annuleren
            </Button>
          </div>
          <label className="filter-name" style={{ cursor: 'default' }}>
            Maak en selectie
          </label>
          <hr />
          <div className="filter-list-div">
            {filtersObjects.slice(0, 2).map((f, i) => {
              const selectedOption = _.find(chips, { type: f.type });
              const x =
                selectedOption !== undefined && f.type !== 'date'
                  ? _.find(f.options, { obj: { value: selectedOption.value } })
                  : 'none';
              return (
                <div key={i}>
                  <FilterExpandableBlock
                    text={f.name}
                    type={f.type}
                    filters={filters}
                    options={f.options}
                    setFilter={setFilter}
                    removeFilter={removeFilter}
                    selectedValue={x === undefined || x === 'none' ? 'none' : x.obj}
                  />
                  <hr />
                </div>
              );
            })}
          </div>
        </div>
      </Dialog>
    );
  }
}

export default FiltersModal;
