import thunk from 'redux-thunk';
import storageSession from 'redux-persist/lib/storage/session';
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from '../reducers/rootReducer';

const enhancer = compose(
  applyMiddleware(thunk),
  // window.devToolsExtension ? window.devToolsExtension() : f => f,
);

const persistConfig = {
  key: 'roota',
  storage: storageSession,
  blacklist: ['dossierModal'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore() {
  const store = createStore(persistedReducer, enhancer);
  const persistor = persistStore(store);
  return { store, persistor };
}
