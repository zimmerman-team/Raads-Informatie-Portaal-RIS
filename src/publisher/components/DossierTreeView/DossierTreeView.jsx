/* base */
import React from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import cx from 'classnames';
import find from 'lodash/find';
import filter from 'lodash/filter';
import { Treebeard, decorators, animations } from 'react-treebeard';
import { getDossierChildren } from '../TextField/Helper';
/* styles */
import style from './style';
import styles from './DossierTreeView.module.scss';
/* mock */

/**
 * todo: Please write a short component description of what this component does
 * @param {Object} customProperty - please describe component property
 */

const propTypes = {
  data: PropTypes.array,
};

const defaultProps = {
  data: [],
};

const _animations = {
  ...animations,
  toggle: ({ node: { toggled } }) => ({
    animation: { rotateZ: toggled ? 90 : 0 },
    duration: 300,
  }),
};

class DossierTreeView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(node, toggled) {
    getDossierChildren(this.props.token, this, node, toggled);
  }

  render() {
    const _decorators = {
      ...decorators,
      Container: props => {
        const isInitial = find(this.props.initialItems, dossier => {
          return dossier.id === props.node.item_id;
        });
        return (
          <div>
            {props.node.has_dossiers &&
              !(isInitial && props.node.child_dossiers_count === 1) && (
                <props.decorators.Toggle
                  style={props.style.toggle}
                  toggled={props.node.toggled}
                  onClick={props.onClick}
                />
              )}
            <props.decorators.Header style={props.style.header} node={props.node} />
          </div>
        );
      },
      Toggle: props => {
        return (
          <div style={props.style.base} onClick={props.onClick}>
            <div style={props.style.wrapper}>
              <i className="material-icons">
                {props.toggled ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
              </i>
            </div>
          </div>
        );
      },
      Header: ({ node, style }) => {
        const isAdded = find(this.props.reduxItems, dossier => {
          return dossier.id === node.item_id;
        });
        const isInitial = find(this.props.initialItems, dossier => {
          return dossier[this.props.modalType === 'dossier' ? 'id' : 'item_id'] === node.item_id;
        });
        const _style = {
          ...style.base,
          width:
            node.has_dossiers &&
            !(isInitial && node.child_dossiers_count === 1 && !this.props.modalType === 'dossier')
              ? 'calc(100% - 30px)'
              : '100%',
          marginLeft:
            node.has_dossiers &&
            !(isInitial && node.child_dossiers_count === 1 && !this.props.modalType === 'dossier')
              ? 0
              : 19,
        };
        const addIconStyle = {
          ...style.iconBtn,
          color: isAdded || isInitial ? 'rgb(255, 127, 0)' : '#009d42',
        };
        return (
          <div style={_style}>
            <i
              style={addIconStyle}
              className={cx('material-icons', styles.addIcon)}
              onClick={() => {
                if (isAdded) {
                  this.props.reduxActionAdd(
                    filter(this.props.reduxItems, item => {
                      return item.id !== node.item_id;
                    }),
                  );
                } else if (isInitial) {
                  this.props.editInitialItem(node.item_id, !isInitial._delete, 'public_dossier');
                } else {
                  this.props.reduxActionAdd(
                    this.props.reduxItems.concat([{ id: node.item_id, name: node.name }]),
                  );
                }
              }}
            >
              add_circle_outline
            </i>
            <div
              style={{
                ...style.title,
                width: 'calc(100% - 30px)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {node.name}
            </div>
          </div>
        );
      },
    };
    return (
      <Treebeard
        style={style}
        data={this.props.data}
        animations={_animations}
        decorators={_decorators}
        onToggle={this.onToggle}
      />
    );
  }
}

DossierTreeView.propTypes = propTypes;
DossierTreeView.defaultProps = defaultProps;

function mapStateToProps(state) {
  const { user, publisher } = state;
  return {
    token: user.token,
    selectedPublicDossierID: publisher.publicDossierSelectedID,
  };
}

export default connect(mapStateToProps, null)(DossierTreeView);
