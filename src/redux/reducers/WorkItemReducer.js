import {
    MODIFY_WORK_ITEM_GROUP
} from '../constants/WorkItemConstants';

const initState = {
    workItemGroup: []
}

function workItem(state = initState, action) {
    switch (action.type) {
        case MODIFY_WORK_ITEM_GROUP:
            return Object.assign({},state,{ workItemGroup: [...action.value]});
        default:
            return state;
    }
}

export default workItem;