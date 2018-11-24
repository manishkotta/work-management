import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import  workItem  from './reducers/WorkItemReducer';
export default (history) => combineReducers({
    router: connectRouter(history),
    workItem
});
