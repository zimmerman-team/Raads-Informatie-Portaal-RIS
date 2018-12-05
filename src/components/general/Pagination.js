import React from 'react';
import Pagination from 'react-js-pagination';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

export default class _Pagination extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      range: 10,
    };
  }

  componentWillMount() {
    this.setState({
      range: this.getPageRange(),
    });
  }

  getPageRange() {
    if (window.innerWidth < 850) {
      const normalWidth = 850;
      const widthOfNumber = 32;
      let numbOfPages = 10;

      let difference = normalWidth - window.innerWidth;
      difference = difference / widthOfNumber;

      numbOfPages = numbOfPages - Math.ceil(difference);
      return numbOfPages < 3 ? 3 : numbOfPages;
    }
    return 10;
  }

  render() {
    const { activePage, itemsCount, onPageChange, color } = this.props;
    return (
      <div className="center-div">
        <Pagination
          activePage={activePage}
          itemsCountPerPage={10}
          totalItemsCount={itemsCount}
          pageRangeDisplayed={this.state.range}
          firstPageText="Eerste"
          prevPageText={<Glyphicon glyph="chevron-left" />}
          nextPageText={<Glyphicon glyph="chevron-right" />}
          lastPageText="Laatste"
          onChange={pageNumber => onPageChange(pageNumber)}
          style={{ color }}
        />
      </div>
    );
  }
}
