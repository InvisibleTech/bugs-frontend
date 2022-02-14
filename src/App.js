import './App.css';
import Bugs from './components/Bugs';
import configureStore from './store/configureStore';

import { Provider } from 'react-redux';
import BugsList from './components/BugsList';

export const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <div>
        <h2>Functional Component</h2>
      </div>
      <BugsList />
      <div>
        <h2>The Class Component</h2>
        <Bugs />
      </div>
    </Provider>
  );
}

export default App;
