import React from 'react';

class About extends React.Component {
  render() {
    const { obj, menu } = this.props;
    return (
      <div className="about-doc-container">
        <div className="notesHeaderTitle">
          <i className="material-icons">insert_drive_file</i>
          <label>Over dit Document</label>
          {menu}
        </div>
        <div className="list">
          <AboutRow label="Document type" value={obj.type} />
          <AboutRow label="Document Status" value={obj.status} status={obj.status} />
          <AboutRow label="Auteur" value={obj.author} />
          <AboutRow label="Dossier" value={obj.dossier} />
        </div>
      </div>
    );
  }
}

export default About;

class AboutRow extends React.Component {
  render() {
    const { label, value, status } = this.props;
    return (
      <div className="row-item">
        <div className="item-descriptor">{label}</div>
        <div className="item-value">{value}</div>
        {status &&
          value !== '' && (
            <div className="item-status">
              <i className="material-icons">check</i>
              {status}
            </div>
          )}
      </div>
    );
  }
}
