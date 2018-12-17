import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Autosuggest from 'react-autosuggest';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import debounce from 'lodash/debounce';
import moment from 'moment';
import appResources from '../../appResources';
import { getItemDetailUrl } from '../../helpers';
import { addFilter } from '../../actions/filterActions';
import { UPLOADED_FILE } from '../../constants';
import { backendUrl } from '../../config';

let search_box_ref;

class SearchField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
    };

    this.unFocus = this.unFocus.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.searchBtnClick = this.searchBtnClick.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.renderSectionTitle = this.renderSectionTitle.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.getSectionSuggestions = this.getSectionSuggestions.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.debouncedLoadSuggestions = debounce(this.onSuggestionsFetchRequested.bind(this), 400);
  }

  componentDidMount() {
    // search_box_ref.focus()
    document
      .querySelector('.react-autosuggest__input')
      .addEventListener('focus', this.props.setFocus);
    document.querySelector('.react-autosuggest__input').addEventListener('blur', this.unFocus);
  }

  unFocus() {
    search_box_ref.blur();
    try {
      this.props.unsetFocus();
    } catch (error) {}
  }

  getSectionSuggestions(section) {
    if (section !== undefined) {
      return section.data;
    }
    return [];
  }

  renderSectionTitle(section) {
    return (
      <Row className="show-grid">
        <Col sm={8} md={8} lg={8}>
          <label>Naam</label>
        </Col>
        <Col sm={2} md={2} lg={2}>
          <label style={{ marginLeft: -15 }}>Type</label>
        </Col>
        <Col sm={2} md={2} lg={2}>
          <label style={{ marginLeft: -15 }}>Datum</label>
        </Col>
      </Row>
    );
  }

  getSuggestionValue(suggestion) {
    return suggestion.id;
  }

  renderSuggestion(suggestion) {
    return (
      <Row className="show-grid">
        <Col sm={8} md={8} lg={8}>
          {suggestion.name}
        </Col>
        <Col sm={2} md={2} lg={2}>
          {`${suggestion.type[0].toUpperCase()}${suggestion.type.substring(1)}`}
        </Col>
        <Col sm={2} md={2} lg={2}>
          {moment(suggestion.date)
            .locale('nl')
            .format('DD MMM YYYY')}
        </Col>
      </Row>
    );
  }

  getSuggestions(event) {
    this.setState({ isLoading: true });
    let suggestions = [];
    const that = this;

    axios
      .get(
        `${appResources.backendUrl}combined/?format=json&page_size=10&page=1&q=${
          event.value
        }&ordering=-date`,
      )
      .then(response => {
        const results = response.data.results;

        suggestions = results.map(r => {
          return {
            id: r.id,
            name: r.name,
            date: r.date,
            type: r.item_type,
            item_id: r.item_id,
          };
        });

        that.setState({
          suggestions: [
            {
              title: 'Search',
              data: suggestions,
            },
          ],
          isLoading: false,
        });
      })
      .catch(e => {});
  }

  onSuggestionsFetchRequested(value) {
    this.getSuggestions(value);
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }

  /* fixme: rename onSuggestionSelected to handleSuggestionSelected */
  onSuggestionSelected(
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method },
  ) {
    if (suggestion.type === UPLOADED_FILE) {
      window.open(`${backendUrl}media/user_files/${suggestion.name}`, '_blank');
    } else {
      const link = getItemDetailUrl(suggestion.type, suggestion.item_id);
      browserHistory.push(link);
    }
  }

  storeInputReference(autosuggest) {
    if (autosuggest !== null) {
      search_box_ref = autosuggest.input;
    }
  }

  onChange(event, { newValue, method }) {
    if (newValue !== '-') {
      this.setState({
        value: newValue,
      });
    }
  }

  onKeyDown(e) {
    if (e.keyCode === 13 && this.state.value !== '') {
      if (this.props.custom) {
        this.props.custom.onEnter(this.state.value);
        this.setState({ value: '' });
      } else {
        this.props.addFilter('search', this.state.value, `Zoekterm: ${this.state.value}`, false);
        this.props.addURLParam && this.props.addURLParam();
        this.setState({ value: '' });
        if (this.props.isSearchPage) {
          this.unFocus();
        } else {
          browserHistory.push('/zoeken');
        }
      }
    }
  }

  /* fixme: rename searchBtnClick to handleSearchBtnClick */
  searchBtnClick() {
    if (this.state.value !== '') {
      if (this.props.custom) {
        this.props.custom.onSearchClick(this.state.value);
        this.setState({ value: '' });
      } else {
        this.props.addFilter('search', this.state.value, `Zoekterm: ${this.state.value}`, false);
        this.props.addURLParam && this.props.addURLParam();
        this.setState({ value: '' });
        if (this.props.isSearchPage) {
          this.unFocus();
        } else {
          browserHistory.push('/zoeken');
        }
      }
    }
  }

  render() {
    const { suggestions, value } = this.state;
    const renderInputComponent = inputProps => (
      <div>
        <input {...inputProps} />
      </div>
    );
    const { custom } = this.props;
    const inputProps = {
      placeholder: this.props.hintText,
      id: 'searchBar',
      value,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
    };

    return (
      <div className="search-block-container">
        <div className="search-icon-div">
          <i className="material-icons" style={{ paddingLeft: '10px' }}>
            search
          </i>
        </div>
        <div className="jr-zoeken search-box">
          <Autosuggest
            multiSection
            suggestions={custom ? custom.suggestions : suggestions}
            onSuggestionsFetchRequested={
              custom ? custom.getSuggestions : this.debouncedLoadSuggestions
            }
            onSuggestionsClearRequested={
              custom ? custom.onSuggestionsClearRequested : this.onSuggestionsClearRequested
            }
            getSuggestionValue={custom ? custom.getSuggestionValue : this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            renderSectionTitle={this.renderSectionTitle}
            renderInputComponent={renderInputComponent}
            getSectionSuggestions={
              custom ? custom.getSectionSuggestions : this.getSectionSuggestions
            }
            inputProps={inputProps}
            ref={this.storeInputReference}
            onSuggestionSelected={this.onSuggestionSelected}
          />
        </div>
        <div className="search-btn-div">
          <button
            className="search-btn"
            style={{
              background: appResources.in_content_color,
              borderColor: appResources.in_content_color,
            }}
            onClick={this.searchBtnClick}
          >
            Zoeken
          </button>
          <button
            className="search-btn-sm"
            style={{
              background: appResources.in_content_color,
              borderColor: appResources.in_content_color,
            }}
            onClick={this.searchBtnClick}
          >
            <i className="material-icons">search</i>
          </button>
        </div>
      </div>
    );
  }
}

export default connect(null, {
  addFilter,
})(SearchField);
