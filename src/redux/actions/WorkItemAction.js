import {
    ADD_WORK_ITEM,
    DELETE_WORK_ITEM,
    RETRIEVE_WORK_ITEM_GROUP,
    EDIT_WORK_ITEM,
    MODIFY_WORK_ITEM_GROUP
} from '../constants/WorkItemConstants';

export function AddWorkItem(workItem) {
    return {
        type: ADD_WORK_ITEM,
        value: workItem
    };
}

export function DeleteWorkItem(workItem) {
    return {
        type: DELETE_WORK_ITEM,
        value: workItem
    };
}

export function RetrieveWorkItemGroup() {
    return {
        type: RETRIEVE_WORK_ITEM_GROUP,
        value: ""
    };
}

export function EditWorkItem(workItem) {
    return {
        type: EDIT_WORK_ITEM,
        value: workItem
    }
}

export function ModifyWorkItemGroup(workItemGroup) {
    return {
        type: MODIFY_WORK_ITEM_GROUP,
        value: [...workItemGroup]
    }
}