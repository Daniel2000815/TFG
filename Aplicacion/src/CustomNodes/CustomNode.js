import React, { memo, useEffect, useContext } from 'react';
import Shader from '../CustomComponents/Shader';
import { useTheme } from '@mui/material/styles';
import Dropdown from '../CustomComponents/Dropdown';
import CustomHandle from './CustomHandle';
import GraphContext from '../GraphPage/GraphContext.js';
import ToggleButton from '../CustomComponents/ToggleButton';
import newId from '../uniqueIdHook';

function CustomNode(props) {
  const [showMore, setShowMore] = React.useState(true);
  const [isHover, setIsHover] = React.useState(false);

  const sharedFunctions = useContext(GraphContext);
  const theme = useTheme();
  const width = 200;

  const nodeStyle = {
    position: 'relative',
    width: `${width}px`,
    display: 'flex',
    flexDirection: 'column',
    transition: 'border 300ms ease',
    borderRadius: '0px 0px 0px 0px',
    backgroundColor: '#fff',

    boxShadow: isHover
      ? '0 6px 12px rgba(0, 0, 0, 0.25), 0 6px 12px rgba(0, 0, 0, 0.25)'
      : '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',

    border: isHover
      ? `1px solid ${theme.palette.primary.dark}`
      : `1px solid ${theme.palette.primary.main}`,

    '&:hover': {
      transition: 'box-shadow 200ms ease',
      boxShadow:
        '0 6px 12px rgba(0, 0, 0, 0.25), 0 6px 12px rgba(0, 0, 0, 0.25)',
      border: `1px solid ${theme.palette.primary.dark}`,
    },
  };

  const headerStyle = {
    height: showMore ? '20px' : '40px',
    width: `${width}px`,
    color: '#EFF7FF',
    borderRadius: '5px 5px 0px 0px',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: showMore ? '14px' : '24px',
    letterSpacing: '0.1px',
    justifyContent: 'flex-start',
    backgroundColor: `${theme.palette.primary.main}`,
  };

  const footerStyle = {
    height: '20px',
    width: `${width}px`,
    color: '#EFF7FF',
    borderRadius: '0px 0px 5px 5px',
    backgroundColor: `${theme.palette.primary.main}`,
  };

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  useEffect(() => {
    console.log(`SDF DE ${props.id} MODIFICADO`);
    sharedFunctions.updateNodeSdf(props.id, props.sdf);
  }, [props.sdf]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 's') setShowMore(!showMore);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showMore]);

  return (
    <div tabIndex="0">
      <div className="nodeHeader" style={headerStyle}>
        {showMore ? props.title : props.currOption}
      </div>

      {showMore ? (
        <div
          className="nodeBody"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={nodeStyle}
        >
          {props.dropdownOptions ? (
            <Dropdown
              defaultValue={props.dropdownOptions[0]}
              onChange={props.onChangeOption}
              items={props.dropdownOptions}
              label={props.title}
            />
          ) : null}

          {showMore ? (
            <>
              {/* <p >{`ID: ${props.id}`}</p>
              <p>
                CHILDREN:{" "}
                {Object.keys(props.data.children)
                  .map((key) => `${props.data.children[key]}`)
                  .join(", ")}
              </p>
              <p>{`SDF: ${props.sdf}`}</p> */}

              {props.body}
              <Shader
                sdf={props.sdf}
                style={{ margin: '10px', height: '100%' }}
              />
            </>
          ) : null}
        </div>
      ) : null}

      <div style={footerStyle}>
        <ToggleButton value={showMore} onClick={() => setShowMore(!showMore)} />
      </div>

      {/* {[...Array(props.nInputs)].map((e, i) =>
        <CustomHandle
          type="target"
          style={{ top: `${50 - ((props.nInputs - 1) / 2) * 5 + i * 5}%` }}
        />
      )
      } */}

      {[...Array(props.nInputs)].map(function (e, i) {
        return (
          <div key={newId('targetHandleContainer_')}>
            <CustomHandle
              type="target"
              style={{ top: `${50 - ((props.nInputs - 1) / 2) * 5 + i * 5}%` }}
            />
          </div>
        );
      })}

      <CustomHandle
        type="source"
        onConnect={(params) => console.log('handle onsConnect', params)}
        style={{ top: '50%' }}
      />
    </div>
  );
}

export default memo(CustomNode);