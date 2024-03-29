import { GroupInformationParser, GroupRemoveMemberComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { CatalogPageName, CreateLinkEvent, GetGroupManager, GetGroupMembers, GetSessionDataManager, LocalizeText, NotificationUtilities, SendMessageComposer, TryJoinGroup, TryVisitRoom } from '../../../api';
import { Button, Column, Flex, Grid, GridProps, LayoutBadgeImageView, Text } from '../../../common';
import { GroupMembershipType } from '../common/GroupMembershipType';
import { GroupType } from '../common/GroupType';

const STATES: string[] = [ 'regular', 'exclusive', 'private' ];

interface GroupInformationViewProps extends GridProps
{
    groupInformation: GroupInformationParser;
    onJoin?: () => void;
    onClose?: () => void;
}

export const GroupInformationView: FC<GroupInformationViewProps> = props =>
{
    const { groupInformation = null, onClose = null, overflow = 'hidden', ...rest } = props;

    const isRealOwner = (groupInformation && (groupInformation.ownerName === GetSessionDataManager().userName));

    const joinGroup = () => (groupInformation && TryJoinGroup(groupInformation.id));

    const leaveGroup = () =>
    {
        NotificationUtilities.confirm(LocalizeText('group.leaveconfirm.desc'), () =>
        {
            SendMessageComposer(new GroupRemoveMemberComposer(groupInformation.id, GetSessionDataManager().userId));

            if(onClose) onClose();
        }, null);
    }

    const getRoleIcon = () =>
    {
        if(groupInformation.membershipType === GroupMembershipType.NOT_MEMBER || groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING) return null;

        if(isRealOwner) return <i className="icon icon-group-owner" title={ LocalizeText('group.youareowner') } />;

        if(groupInformation.isAdmin) return <i className="icon icon-group-admin" title={ LocalizeText('group.youareadmin') } />;

        return <i className="icon icon-group-member" title={ LocalizeText('group.youaremember') } />;
    }

    const getButtonText = () =>
    {
        if(isRealOwner) return 'group.youareowner';

        if(groupInformation.type === GroupType.PRIVATE && groupInformation.membershipType !== GroupMembershipType.MEMBER) return '';

        if(groupInformation.membershipType === GroupMembershipType.MEMBER) return 'group.leave';

        if((groupInformation.membershipType === GroupMembershipType.NOT_MEMBER) && groupInformation.type === GroupType.REGULAR) return 'group.join';

        if(groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING) return 'group.membershippending';

        if((groupInformation.membershipType === GroupMembershipType.NOT_MEMBER) && groupInformation.type === GroupType.EXCLUSIVE) return 'group.requestmembership';
    }

    const handleButtonClick = () =>
    {
        if((groupInformation.type === GroupType.PRIVATE) && (groupInformation.membershipType === GroupMembershipType.NOT_MEMBER)) return;

        if(groupInformation.membershipType === GroupMembershipType.MEMBER)
        {
            leaveGroup();

            return;
        }

        joinGroup();
    }

    const handleAction = useCallback((action: string) =>
    {
        switch(action)
        {
            case 'members':
                GetGroupMembers(groupInformation.id);
                break;
            case 'members_pending':
                GetGroupMembers(groupInformation.id, 2);
                break;
            case 'manage':
                GetGroupManager(groupInformation.id);
                break;
            case 'homeroom':
                TryVisitRoom(groupInformation.roomId);
                break;
            case 'furniture':
                CreateLinkEvent('catalog/open/' + CatalogPageName.GUILD_CUSTOM_FURNI);
                break;
            case 'popular_groups':
                CreateLinkEvent('navigator/search/groups');
                break;
        }
    }, [ groupInformation ]);

    if(!groupInformation) return null;

    return (
        <Grid overflow={ overflow } { ...rest }>
            <Column center size={ 3 } overflow="hidden">
                <Flex alignItems="center" overflow="hidden" className="group-badge">
                    <LayoutBadgeImageView badgeCode={ groupInformation.badge } isGroup={ true } scale={ 2 } />
                </Flex>
                <Column alignItems="center" gap={ 1 }>
                    <Text style={{color: "var(--test-galaxytext)"}} variant="none" small underline pointer onClick={ () => handleAction('members') }>{ LocalizeText('group.membercount', [ 'totalMembers' ], [ groupInformation.membersCount.toString() ]) }</Text>
                    { (groupInformation.pendingRequestsCount > 0) &&
                        <Text style={{color: "var(--test-galaxytext)"}} variant="none" small underline pointer onClick={ () => handleAction('members_pending') }>{ LocalizeText('group.pendingmembercount', [ 'amount' ], [ groupInformation.pendingRequestsCount.toString() ]) }</Text> }
                    { groupInformation.isOwner &&
                        <Text style={{color: "var(--test-galaxytext)"}} variant="none" small underline pointer onClick={ () => handleAction('manage') }>{ LocalizeText('group.manage') }</Text> }
                </Column>
                { getRoleIcon() }
            </Column>
            <Column size={ 9 } justifyContent="between" overflow="auto">
                <Column overflow="hidden">
                    <Column gap={ 1 }>
                        <Flex alignItems="center" gap={ 2 }>
                            <Text style={{color: "var(--test-galaxytext)"}} variant="none" bold>{ groupInformation.title }</Text>
                            <Flex gap={ 1 }>
                                <i className={ 'icon icon-group-type-' + groupInformation.type } title={ LocalizeText(`group.edit.settings.type.${ STATES[groupInformation.type] }.help`) } />
                                { groupInformation.canMembersDecorate &&
                                    <i className="icon icon-group-decorate" title={ LocalizeText('group.memberscandecorate') } /> }
                            </Flex>
                        </Flex>
                        <Text style={{color: "var(--test-galaxytext)"}} variant="none" small>{ LocalizeText('group.created', [ 'date', 'owner' ], [ groupInformation.createdAt, groupInformation.ownerName ]) }</Text>
                    </Column>
                    <Text style={{color: "var(--test-galaxytext)"}} variant="none" small overflow="auto" className="group-description">{ groupInformation.description }</Text>
                </Column>
                <Column>
                    <Column gap={ 1 }>
                        <Text style={{color: "var(--test-galaxytext)"}} variant="none" small underline pointer onClick={ () => handleAction('homeroom') }>{ LocalizeText('group.linktobase') }</Text>
                        <Text style={{color: "var(--test-galaxytext)"}} variant="none" small underline pointer onClick={ () => handleAction('furniture') }>{ LocalizeText('group.buyfurni') }</Text>
                        <Text style={{color: "var(--test-galaxytext)"}} variant="none" small underline pointer onClick={ () => handleAction('popular_groups') }>{ LocalizeText('group.showgroups') }</Text>
                    </Column>
                   { (groupInformation.type !== GroupType.PRIVATE || groupInformation.type === GroupType.PRIVATE && groupInformation.membershipType === GroupMembershipType.MEMBER) &&
                        <Button disabled={ (groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING) || isRealOwner } onClick={ handleButtonClick }>
                            { LocalizeText(getButtonText()) }
                        </Button> }
                </Column>
            </Column>
        </Grid>
    );
};
