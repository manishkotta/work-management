import {
    ADD_WORK_ITEM,
    DELETE_WORK_ITEM,
    RETRIEVE_WORK_ITEM_GROUP,
    MODIFY_WORK_ITEM_GROUP,
    EDIT_WORK_ITEM
} from '../constants/WorkItemConstants';

export default store => next => action => {
    var state = store.getState();
    const { workItem: { workItemGroup } } = state;
    switch (action.type) {
        case ADD_WORK_ITEM:
            if (!action.value) return;
            var workItem = action.value;
            let id = Math.max(workItemGroup.map(function (item) { return item.id; }));
            workItem.id = id += 1;
            workItem.workItemStatus = "In Progress";
            var modifiedWorkItemGroup = [...workItemGroup, workItem];
            saveToLocalStorage(modifiedWorkItemGroup);
            next({
                type: MODIFY_WORK_ITEM_GROUP,
                value: modifiedWorkItemGroup
            })
            break;
        case DELETE_WORK_ITEM:
            if (!action.value) return;
            var workItem = action.value;
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
        debugger;
            if (!action.value) return;
            var workItem = action.value;
            var modifiedWorkItemGroup = workItemGroup.map((item) => {
                if (item.id === workItem.id) {
                    item.dueDate = workItem.dueDate;
                    item.workItem = workItem.workItem;
                    item.noOfResources = workItem.noOfResources;
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