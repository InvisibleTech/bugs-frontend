import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUnresolvedBugs, loadBugs, resolveBug } from '../store/bugs';

const BugsList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadBugs());
  }, [dispatch]);

  const bugs = useSelector(getUnresolvedBugs);

  return (
    <div>
      <ul>
        {bugs.map((b) => (
          <li key={b.id}>
            {b.description}
            &nbsp;
            <button
              onClick={() => {
                dispatch(resolveBug(b.id, true));
              }}
            >
              Resolve
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BugsList;
