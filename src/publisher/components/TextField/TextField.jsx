/* base */
import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import cx from 'classnames';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import moment from 'moment';
import onClickOutside from 'react-onclickoutside';
import debounce from 'lodash/debounce';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import { getSuggestions } from './Helper';
import { getFormattedType, isArrayEqual } from '../../../helpers';
import loadingSVG from '../../../icons/loading.svg';
import appResources from '../../../appResources';
import DossierTreeView from '../DossierTreeView/DossierTreeView';
/* styles */
import styles from './TextField.module.scss';
/* mock */
// import mock from './TextField.mock';

/**
 * todo: Please write a short component description of what this component does
 * @param {Object} customProperty - please describe component property
 */

const propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  hintText: PropTypes.string,
  reduxItems: PropTypes.array,
  reduxItemsAdd: PropTypes.func,
  extraLoadFunction: PropTypes.func,
  dossierSingleSelect: PropTypes.bool,
  initialValue: PropTypes.string,
  inputType: PropTypes.string,
  modalType: PropTypes.string,
  isReadOnly: PropTypes.bool,
};

const defaultProps = {
  type: '',
  hintText: '',
  required: true,
  reduxItems: [],
  reduxItemsAdd: null,
  id: shortid.generate(),
  extraLoadFunction: null,
  dossierSingleSelect: false,
  initialValue: '',
  inputType: 'text',
  modalType: '',
  isReadOnly: false,
};

class TextField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      value: '',
      itemsTotal: 0,
      focused: false,
      loading: false,
      suggestions: [],
      selectedItems: [...props.reduxItems],
      titleExists: false,
      backgroundColor: '#f4f5f7',
    };

    this.onScroll = this.onScroll.bind(this);
    this.onChange = this.onChange.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.onItemsAdd = this.onItemsAdd.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.onCheckBoxClick = this.onCheckBoxClick.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.fetchSuggestions = this.fetchSuggestions.bind(this);
    this.renderSectionTitle = this.renderSectionTitle.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.checkIfTitleExists = this.checkIfTitleExists.bind(this);
    this.renderEventTemplateRow = this.renderEventTemplateRow.bind(this);
    this.debouncedLoadSuggestions = debounce(this.fetchSuggestions, 400);
  }

  fetchSuggestions() {
    this.setState({ loading: true });
    getSuggestions(this.props.type, 1, this.state.value, this);
  }

  // componentWillMount() {
  //   if (this.props.type !== 'title' && this.props.type !== 'number') {
  //     this.fetchSuggestions();
  //   }
  // }

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.scrollDivRef).addEventListener('scroll', this.onScroll);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!isArrayEqual(prevProps.reduxItems, this.props.reduxItems)) {
      this.setState({ selectedItems: this.props.reduxItems });
    }
  }

  onScroll() {
    if (
      ReactDOM.findDOMNode(this.refs.scrollDivRef).scrollHeight -
        ReactDOM.findDOMNode(this.refs.scrollDivRef).scrollTop ===
        400 &&
      this.state.itemsTotal > this.state.suggestions.length
    ) {
      getSuggestions(this.props.type, this.state.page + 1, this.state.value, this);
      this.setState({ page: this.state.page + 1 });
    }
  }

  handleClickOutside() {
    if (this.props.type !== 'document' && this.props.type !== 'public_dossier') {
      this.setState({ backgroundColor: '#f4f5f7' });
    }
  }

  renderSectionTitle() {
    return (
      <Row className="show-grid" style={{ borderBottom: 'solid 1px #707070', margin: '5px 0' }}>
        <Col sm={12} md={8} lg={8}>
          <label>Titel</label>
        </Col>
        <Col xsHidden md={2} lg={2}>
          <label>Type</label>
        </Col>
        <Col xsHidden md={2} lg={2}>
          <label>Laatst gewijzigd</label>
        </Col>
      </Row>
    );
  }

  renderSuggestion(suggestion) {
    const checked = find(this.state.selectedItems, i => {
      return i.id === suggestion.id;
    });
    return (
      <Row
        key={shortid.generate()}
        className="show-grid"
        style={{ margin: '10px 0', zIndex: 9999 }}
      >
        <Col sm={12} md={8} lg={8} style={{ zIndex: 9999 }}>
          <input
            type="checkbox"
            name={suggestion.name}
            value={suggestion.id}
            className={styles.checkbox}
            checked={checked !== undefined}
            onChange={() => this.onCheckBoxClick(suggestion)}
          />
          <div className={styles.docName} title={suggestion.name}>
            <div>{suggestion.name}</div>
          </div>
        </Col>
        <Col xsHidden md={2} lg={2}>
          {getFormattedType(suggestion.type)}
        </Col>
        <Col xsHidden md={2} lg={2}>
          {moment(suggestion.date)
            .locale('nl')
            .format('DD MMM YYYY')}
        </Col>
      </Row>
    );
  }

  renderEventTemplateRow(item) {
    return (
      <Row
        key={item.id}
        className={cx('show-grid', styles.eventRow)}
        onClick={() => {
          this.props.reduxItemsAdd(item);
          this.setState({ focused: false });
        }}
      >
        <Col sm={12} md={12} lg={12}>
          {this.props.type === 'agenda_item' && (
            <React.Fragment>
              <b>{item.id}</b>
              {'   -   '}
              <span className={styles.agendaItemName}>{item.name}</span>
            </React.Fragment>
          )}
          {this.props.type !== 'agenda_item' && (
            <React.Fragment>
              <b>{item.name}</b>
              {this.props.type === 'author' && <React.Fragment> - {item.email}</React.Fragment>}
            </React.Fragment>
          )}
        </Col>
      </Row>
    );
  }

  onCheckBoxClick(item) {
    const value = parseInt(item.id, 10);
    let items = this.state.selectedItems;
    if (
      find(items, i => {
        return i.id === value;
      })
    ) {
      items = filter(items, i => {
        return i.id !== value;
      });
    } else {
      items.push({
        id: value,
        type: item.type,
        name: item.name,
        item_id: parseInt(item.item_id, 10),
      });
    }
    if (items.length === 0) {
      if (this.state.selectedItems.length > 0) {
        this.nameInput.focus();
        this.props.reduxItemsAdd([]);
      }
    }
    this.setState({ selectedItems: items, focused: true });
  }

  onChange(event) {
    // if (this.props.type === 'title') {
    //   this.checkIfTitleExists(event.target.value);
    // }
    if (
      this.props.type === 'status' ||
      this.props.type === 'subject' ||
      this.props.type === 'portfolio'
    ) {
      this.props.reduxItemsAdd({ id: event.target.value, name: event.target.value });
    } else if (
      this.props.type !== 'public_dossier' &&
      this.props.type !== 'document' &&
      this.props.type !== 'agenda_item'
    ) {
      this.props.reduxItemsAdd(event.target.value);
    }
    this.setState(
      {
        suggestions: [],
        value: event.target.value,
      },
      () => {
        if (this.props.type !== 'title' && this.props.type !== 'description') {
          this.debouncedLoadSuggestions();
        }
      },
    );
  }

  checkIfTitleExists(title) {
    const that = this;
    if (this.props.type === 'title') {
      axios
        .post(`${appResources.backendUrl}public-dossiers/check-title/`, { title })
        .then(response => {
          that.setState({
            titleExists: response.data.exists,
          });
          that.props.reduxItemsAdd(title, response.data.exists);
        })
        .catch(error => {});
    }
  }

  onInputFocus() {
    this.setState({ focused: true, backgroundColor: '#e3e3e3' });
    if (
      this.props.type !== 'title' &&
      this.props.type !== 'number' &&
      this.state.suggestions.length === 0
    ) {
      this.fetchSuggestions();
    }
  }

  onInputBlur() {}

  getContainerBorderColor() {
    if (this.props.type === 'title' && this.state.value !== '') {
      if (this.state.titleExists) {
        return 'red';
      }
      return '#00bc1d';
    } else if (
      (this.props.type === 'event_template' ||
        this.props.type === 'author' ||
        this.props.type === 'doc_type' ||
        this.props.type === 'status' ||
        this.props.type === 'subject' ||
        this.props.type === 'portfolio' ||
        this.props.type === 'agenda_item' ||
        this.props.type === 'public_dossier') &&
      this.props.template
    ) {
      return '#00bc1d';
    } else if (this.props.type === 'title' && get(this.props.template, 'name', '') !== '') {
      return '#00bc1d';
    } else if (this.props.reduxItems.length > 0) {
      return '#00bc1d';
    }
    return '#f4f5f7';
  }

  onItemsAdd() {
    this.props.reduxItemsAdd(this.state.selectedItems);
    this.setState({ focused: false });
  }

  removeItem(id) {
    let items = this.props.reduxItems;
    if (
      find(items, i => {
        return i.id === id;
      })
    ) {
      items = filter(items, i => {
        return i.id !== id;
      });
    }
    this.props.reduxItemsAdd(items);
  }

  render() {
    const { value, focused } = this.state;
    let suggestions = this.state.suggestions;
    if (this.props.initialItems) {
      for (let i = 0; i < this.props.initialItems.length; i++) {
        for (let x = 0; x < suggestions.length; x++) {
          if (
            this.props.initialItems[i][
              this.props.modalType === 'agenda_item' ? 'combined_id' : 'id'
            ] === suggestions[x].id
          ) {
            // eslint-disable-next-line
            suggestions = filter(suggestions, s => {
              return (
                this.props.initialItems[i][
                  this.props.modalType === 'agenda_item' ? 'combined_id' : 'id'
                ] !== s.id
              );
            });
          }
        }
      }
    }
    const inputProps = {
      className: cx(
        styles.input,
        this.props.type === 'title' && styles.titleInput,
        this.props.type === 'description' && styles.descriptionInput,
        this.props.type === 'number' && styles.numberInput,
      ),
      type: this.props.inputType,
      placeholder: this.props.hintText,
      value: this.props.template
        ? this.props.template.name
        : this.props.initialValue !== value && this.props.initialValue
          ? this.props.initialValue
          : value,
      onChange: this.onChange,
      onFocus: this.onInputFocus,
      onBlur: this.onInputBlur,
      ref: input => {
        this.nameInput = input;
      },
      rows: this.props.type === 'description' ? (value.length > 0 ? 5 : 1) : 1,
      readOnly: this.props.isReadOnly,
    };
    if (this.props.type === 'number') {
      inputProps.min = this.props.min;
    }
    const shouldOpen =
      (focused || !isArrayEqual(this.state.selectedItems.length, this.props.reduxItems.length)) &&
      (this.props.type !== 'title' &&
        this.props.type !== 'description' &&
        this.props.type !== 'number');
    const containerBorderColor = this.getContainerBorderColor();
    return (
      <React.Fragment>
        {shouldOpen &&
          this.props.type === 'document' && (
            <button className={styles.button} onClick={this.onItemsAdd}>
              Toevoegen
            </button>
          )}
        <div
          className={styles.component}
          style={{
            borderColor: containerBorderColor,
            background: this.state.backgroundColor,
            marginTop: this.props.type === 'document' && shouldOpen ? 10 : 30,
          }}
        >
          <span className={styles.asterisk}>{this.props.required ? '*' : ''}</span>
          {this.props.type === 'description' ? (
            <textarea {...inputProps} />
          ) : (
            <input {...inputProps} />
          )}
          {this.props.type !== 'title' &&
            this.props.type !== 'description' &&
            this.props.type !== 'number' &&
            !this.state.loading && (
              <i
                onClick={() => {
                  if (shouldOpen) {
                    this.setState({ focused: false, backgroundColor: '#f4f5f7' });
                  } else {
                    this.nameInput.focus();
                  }
                }}
                className={cx('material-icons', styles.arrowIcon)}
              >
                {shouldOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              </i>
            )}
          {this.state.loading && <img alt="arrow" className={styles.arrowIcon} src={loadingSVG} />}
          {this.props.type === 'number' && (
            <div className={styles.numberBtns}>
              <button
                className={styles.numberBtn}
                onClick={() => {
                  this.props.reduxItemsAdd(this.props.template.value + 1);
                }}
              >
                +
              </button>
              <button
                className={styles.numberBtn}
                onClick={() => {
                  if (this.props.template.value > 0)
                    this.props.reduxItemsAdd(this.props.template.value - 1);
                }}
              >
                -
              </button>
            </div>
          )}
        </div>
        <div
          className={styles.suggestionsContainer}
          style={{ display: shouldOpen ? 'block' : 'none' }}
        >
          {this.props.type === 'document' && this.renderSectionTitle()}
          <div className={styles.suggestionsList} ref="scrollDivRef">
            {this.props.type === 'document' &&
              suggestions.map(s => {
                return this.renderSuggestion(s);
              })}
            {(this.props.type === 'event_template' ||
              this.props.type === 'author' ||
              this.props.type === 'doc_type' ||
              this.props.type === 'status' ||
              this.props.type === 'subject' ||
              this.props.type === 'agenda_item' ||
              this.props.type === 'portfolio') &&
              suggestions.map(s => {
                return this.renderEventTemplateRow(s);
              })}
            {this.props.type === 'public_dossier' && (
              <DossierTreeView
                data={suggestions.map(s => {
                  return {
                    id: s.id,
                    name: s.name,
                    item_id: s.item_id,
                    has_dossiers: s.has_dossiers,
                    child_dossiers_count: s.child_dossiers_count,
                  };
                })}
                modalType={this.props.modalType}
                reduxItems={this.props.reduxItems}
                reduxActionAdd={items => {
                  this.props.reduxItemsAdd(items);
                  if (this.props.dossierSingleSelect) {
                    this.setState({ focused: false });
                  }
                }}
                initialItems={this.props.initialItems}
                editInitialItem={this.props.editInitialItem}
              />
            )}
            {this.state.loading && <div className={styles.loadingMessage}>Loading...</div>}
            {suggestions.length === 0 &&
              !this.state.loading && <div className={styles.loadingMessage}>Geen resultaten</div>}
          </div>
        </div>
        {this.props.showSelectedItems &&
          (this.props.type === 'document' || this.props.type === 'public_dossier') &&
          this.props.reduxItems.map(i => {
            return (
              <div
                key={i.id}
                className={styles.selectedItem}
                style={{ background: appResources.in_content_color }}
              >
                <span className={styles.itemName}>{i.name || i.text}</span>
                <i
                  className={cx('material-icons', styles.removeIcon)}
                  onClick={() => this.removeItem(i.id)}
                >
                  cancel
                </i>
              </div>
            );
          })}
        {this.props.showSelectedItems &&
          (this.props.type === 'document' || this.props.type === 'public_dossier') &&
          this.props.initialItems.map(i => {
            return (
              <div
                key={i.id}
                className={styles.selectedItem}
                style={{ background: appResources.in_content_color }}
              >
                <span className={styles.itemName}>{i.name || i.text}</span>
                <i
                  className={cx('material-icons', styles.removeIcon)}
                  onClick={() => this.props.editInitialItem(i.id, !i._delete, 'document')}
                >
                  cancel
                </i>
              </div>
            );
          })}
      </React.Fragment>
    );
  }
}

TextField.propTypes = propTypes;
TextField.defaultProps = defaultProps;

export default onClickOutside(TextField);
