import { memo } from 'react';
import { MotionGetAttention } from './MotionElements';
import UserAvatar from './UserAvatar';
import { Tag, TagRightIcon, TagLabel } from "@chakra-ui/react";
import { FaArrowAltCircleRight } from 'react-icons/fa';

export default memo(function OrderCard ({isAllOrdersPage, uid, status, ...props}) {
    let getAttention = false;
    let label; // initial, accepted, rejected, paidByUser, completed
    let colorScheme = 'grey';
    let icon = FaArrowAltCircleRight;
    if (status === 'initial') {
        getAttention = !isAllOrdersPage;
        label = 'Pending confirmation';
        colorScheme = 'yellow';
    }
    else if (status === 'accepted') {
        getAttention = isAllOrdersPage;
        label = 'Awaiting payment';
        colorScheme = 'cyan';
    }
    else if (status === 'rejected') {
        label = 'Rejected';
        colorScheme = 'red';
    }
    else if (status === 'paidByUser') {
        getAttention = !isAllOrdersPage;
        label = 'Work in progress';
        colorScheme = 'orange';
    }
    else if (status === 'completed') {
        label = 'Completed';
        colorScheme = 'green';
    }
    return (
        <MotionGetAttention attentionType={getAttention?'expand' : 'normal'}>
            <Tag minWidth='7em' size='md' colorScheme={colorScheme} {...props} >
                <UserAvatar uid={uid} placement='right' />
                <TagLabel>{label}</TagLabel>
                <TagRightIcon as={icon} />
            </Tag>
        </MotionGetAttention>
    );
});