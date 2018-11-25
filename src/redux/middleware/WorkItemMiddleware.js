import {
    ADD_WORK_ITEM,
    DELETE_WORK_ITEM,
    MODIFY_WORK_ITEM_GROUP,
    EDIT_WORK_ITEM
} from '../constants/WorkItemConstants';

export default store => next => action => {
    var state = store.getState();
    const { workItem: { workItemGroup } } = state;
    var workItem = action.value;
    switch (action.type) {
        case ADD_WORK_ITEM:
            if (!action.value) return;
            debugger;
            let s = workItemGroup.map(function (item) { return item.id; });
            let id = Math.max(...s);
            id = !Number.isInteger(id) ? 0 : id;
            workItem.id = id + 1;
            workItem.workStatus = "Active";
            var modifiedWorkItemGroupADD = [...workItemGroup, workItem];
            saveToLocalStorage(modifiedWorkItemGroupADD);
            next({
                type: MODIFY_WORK_ITEM_GROUP,
                value: modifiedWorkItemGroupADD
            })
            break;
        case DELETE_WORK_ITEM:
            if (!action.value) return;
            var removeIndex = workItemGroup.map(function (item) { return item.id; }).indexOf(workItem.id);
            if (removeIndex !== -1) {
                workItemGroup.splice(removeIndex, 1);
            }
            saveToLocalStorage(workItemGroup);
            next({
                type: MODIFY_WORK_ITEM_GROUP,
                value: [...workItemGroup]
            })
            break;
        case EDIT_WORK_ITEM:
            if (!action.value) return;
            var modifiedWorkItemGroup = workItemGroup.map((item) => {
                if (item.id === workItem.id) {
                    item.dueDate = workItem.dueDate;
                    item.workItem = workItem.workItem;
                    item.noOfResources = workItem.noOfResources;
                    item.workStatus = workItem.workStatus
                }
                return item;
            })
            saveToLocalStorage(modifiedWorkItemGroup);
            next({
                type: MODIFY_WORK_ITEM_GROUP,
                value: [...modifiedWorkItemGroup]
            });
            break;
        case MODIFY_WORK_ITEM_GROUP:
            saveToLocalStorage(action.value);
            next({
                type: MODIFY_WORK_ITEM_GROUP,
                value: [...action.value]
            });
            break;
        default:
            next(action);
            break;
    }
    next(action);
};


function saveToLocalStorage(workItemGroup) {
    if (!workItemGroup || workItemGroup.length <= 0) localStorage.removeItem('work-item-group');
    localStorage.setItem("work-item-group", JSON.stringify(workItemGroup));
}