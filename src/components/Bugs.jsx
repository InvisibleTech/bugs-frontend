import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUnresolvedBugs, loadBugs, resolveBug } from '../store/bugs';

// This is the presentation component
class Bugs extends Component {
  componentDidMount() {
    this.props.loadBugs();
  }

  componentWillUnmount() {}

  render() {
    return (
      <div>
        <ul>
          {this.props.bugs.map((b) => (
            <li key={b.id}>
              {b.description}
              &nbsp;
              <button
                onClick={() => {
                  this.props.resolveBug(b.id);
                }}
              >
                Resolve
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  bugs: getUnresolvedBugs(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadBugs: () => dispatch(loadBugs()),
  resolveBug: (id) => dispatch(resolveBug(id, true)),
});

// Container Component wraps Presentation Component
export default connect(mapStateToProps, mapDispatchToProps)(Bugs);
