import React from 'react';
import Autosuggest from 'react-autosuggest';
import appResources from '../../../appResources';

let search_box_ref;

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.unFocus = this.unFocus.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.searchBtnClick = this.searchBtnClick.bind(this);
  }

  componentDidMount() {
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
      this.props.addChip(this.state.value);
      this.unFocus();
      this.setState({ value: '' });
    }
  }

  searchBtnClick() {
    if (this.state.value !== '') {
      this.props.addChip(this.state.value);
      this.unFocus();
      this.setState({ value: '' });
    }
  }

  render() {
    const { value } = this.state;
    const renderInputComponent = inputProps => (
      <div>
        <input {...inputProps} />
      </div>
    );
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
            inputProps={inputProps}
            ref={this.storeInputReference}
            renderInputComponent={renderInputComponent}
            suggestions={[]}
            renderSuggestion={() => null}
            getSuggestionValue={() => null}
            onSuggestionsFetchRequested={() => null}
            onSuggestionsClearRequested={() => null}
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

export default Search;
