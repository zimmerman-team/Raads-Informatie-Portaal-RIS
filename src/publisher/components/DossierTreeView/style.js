export default {
  tree: {
    base: {
      listStyle: 'none',
      overflow: 'hidden',
      backgroundColor: '#fff',
      margin: 0,
      padding: 20,
      color: '#5a5a5a',
      fontSize: '14px',
    },
    node: {
      base: {
        position: 'relative',
      },
      link: {
        cursor: 'pointer',
        position: 'relative',
        padding: '0px 5px',
        display: 'block',
      },
      activeLink: {},
      toggle: {
        base: {
          position: 'relative',
          display: 'inline-block',
          verticalAlign: 'middle',
          marginLeft: '-5px',
          height: '24px',
          width: '24px',
          cursor: 'pointer',
        },
        wrapper: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          margin: '-12px 0 0 -12px',
          height: '14px',
        },
        height: 14,
        width: 14,
        arrow: {
          fill: '#9DA5AB',
          strokeWidth: 0,
        },
      },
      header: {
        base: {
          display: 'inline-block',
          verticalAlign: 'middle',
          color: '#5a5a5a',
          fontWeight: 'bold',
          padding: '5px 5px 5px 0',
        },
        iconBtn: {
          display: 'inline-block',
          color: '#009d42',
          fill: '#009d42',
          marginRight: 2,
          verticalAlign: 'middle',
          cursor: 'pointer',
        },
        connector: {
          width: '2px',
          height: '12px',
          borderLeft: 'solid 2px black',
          borderBottom: 'solid 2px black',
          position: 'absolute',
          top: '0px',
          left: '-21px',
        },
        title: {
          display: 'inline-block',
          lineHeight: '24px',
          verticalAlign: 'middle',
        },
      },
      subtree: {
        listStyle: 'none',
        paddingLeft: '24px',
      },
      loading: {
        color: '#E2C089',
      },
    },
  },
};
