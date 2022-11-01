import { FC, useMemo } from 'react';
import { Base, BaseProps, Flex, Text } from '..';
import { LocalizeText } from '../../api';

interface LayoutCatalogueDiscountViewProps extends BaseProps<HTMLDivElement>
{
    amountFree?: number;
}

export const LayoutCatalogueDiscountView: FC<LayoutCatalogueDiscountViewProps> = props =>
{
    const { amountFree = 0, classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'nitro-catalogue-discount' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <>
            <Flex alignItems="center" gap={ 1 }>
                <Text variant="black" small wrap style={ { width: '100px', backgroundColor: '#91D17B', fontStyle: 'italic' } }>{ amountFree + ' ' + LocalizeText('groupprofile.joining_policy_settings.free') }</Text>
                <Base classNames={ getClassNames } { ...rest }>{ children }</Base>
            </Flex>
        </>
    );
}