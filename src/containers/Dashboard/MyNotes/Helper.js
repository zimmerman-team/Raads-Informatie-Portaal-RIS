export function getDocBackendUrl(note) {
  switch (parseInt(note.type, 10)) {
    case 0:
      return `documents/${note.doc_id}`;
    case 1:
      return `received_documents/${note.doc_id}`;
    case 2:
      return `council_addresses/${note.doc_id}`;
    case 3:
      return `written_questions/${note.doc_id}`;
    case 4:
      return `public_documents/${note.doc_id}`;
    case 5:
      return `policy_documents/${note.doc_id}`;
    case 6:
      return `management_documents/${note.doc_id}`;
    case 7:
      return `motions/${note.doc_id}`;
    case 8:
      return `commitments/${note.doc_id}`;
    default:
      return '';
  }
}

export function getDocDetails(data, type) {
  switch (parseInt(type, 10)) {
    case 0:
      return {
        id: data.id,
        category: 'Brief aan de Raad',
        status: 'Onvoldoende Besproken',
        name: data.text,
        date: data.date,
        notes: data.notes,
        type: 'Document',
        author: '',
        fileUrl: data.url.charAt(4) !== 's' ? data.url.replace('http', 'https') : data.url,
      };
    case 1:
      return {
        id: data.id,
        category: 'Brief aan de Raad',
        status: 'Onvoldoende Besproken',
        name: data.title,
        date: data.date,
        notes: data.notes,
        type: 'P&C Cyclus',
        author: '',
        fileUrl:
          data.document !== null
            ? data.document.url.charAt(4) !== 's'
              ? data.document.url.replace('http', 'https')
              : data.document.url
            : '',
      };
    case 2:
      return {
        id: data.id,
        category: 'Brief aan de Raad',
        status: 'Onvoldoende Besproken',
        name: data.title,
        date: data.publication_date,
        notes: data.notes,
        type: 'Brief aan de raad',
        author: '',
        fileUrl:
          data.question_document !== null
            ? data.question_document.url.charAt(4) !== 's'
              ? data.question_document.url.replace('http', 'https')
              : data.question_document.url
            : '',
      };
    case 3:
      return {
        id: data.id,
        category: 'Brief aan de Raad',
        status: 'Onvoldoende Besproken',
        name: data.title,
        date: data.question_date,
        type: 'Schriftelijke vragen',
        notes: data.notes,
        author: data.portfolio_holder || '',
        fileUrl:
          data.question_document !== null
            ? data.question_document.url.charAt(4) !== 's'
              ? data.question_document.url.replace('http', 'https')
              : data.question_document.url
            : '',
      };
    case 4:
      return {
        id: data.id,
        category: 'Brief aan de Raad',
        status: 'Onvoldoende Besproken',
        name: data.title,
        date: data.date_created,
        notes: data.notes,
        type: 'Formats',
        author: data.portfolio_holder || '',
        fileUrl:
          data.document !== null
            ? data.document.url.charAt(4) !== 's'
              ? data.document.url.replace('http', 'https')
              : data.document.url
            : '',
      };
    case 5:
      return {
        id: data.id,
        category: 'Brief aan de Raad',
        status: 'Onvoldoende Besproken',
        name: data.title,
        date: data.publication_date,
        notes: data.notes,
        type: 'Presidium besluitenlijsten',
        author: data.portfolio_holder || '',
        fileUrl:
          data.document !== null
            ? data.document.url.charAt(4) !== 's'
              ? data.document.url.replace('http', 'https')
              : data.document.url
            : '',
      };
    case 6:
      return {
        id: data.id,
        category: 'Brief aan de Raad',
        status: 'Onvoldoende Besproken',
        name: data.title,
        date: data.publication_date,
        notes: data.notes,
        type: 'Raadsbrieven',
        author: data.portfolio_holder || '',
        fileUrl:
          data.document !== null
            ? data.document.url.charAt(4) !== 's'
              ? data.document.url.replace('http', 'https')
              : data.document.url
            : '',
      };
    case 7:
      return {
        id: data.id,
        category: 'Brief aan de Raad',
        status: 'Onvoldoende Besproken',
        name: data.title,
        date: data.date_created || data.meeting_date,
        notes: data.notes,
        type: 'Motie',
        author: data.portfolio_holder || '',
        fileUrl:
          data.document !== null
            ? data.document.url.charAt(4) !== 's'
              ? data.document.url.replace('http', 'https')
              : data.document.url
            : '',
      };
    case 8:
      return {
        id: data.id,
        category: 'Brief aan de Raad',
        status: 'Onvoldoende Besproken',
        name: data.title,
        date: data.commitment_date,
        notes: data.notes,
        type: 'Toezeggingen',
        author: data.portfolio_holder || '',
        fileUrl:
          data.new_document !== null
            ? data.new_document.url.charAt(4) !== 's'
              ? data.new_document.url.replace('http', 'https')
              : data.new_document.url
            : '',
      };
    default:
      return '';
  }
}
