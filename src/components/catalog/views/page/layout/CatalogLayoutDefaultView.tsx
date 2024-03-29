import { FC } from 'react';
import { GetConfiguration, ProductTypeEnum } from '../../../../../api';
import { Base, Column, Flex, Grid, Text,LayoutCatalogueDiscountView } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogHeaderView } from '../../catalog-header/CatalogHeaderView';
import { CatalogAddOnBadgeWidgetView } from '../widgets/CatalogAddOnBadgeWidgetView';
import { CatalogItemGridWidgetView } from '../widgets/CatalogItemGridWidgetView';
import { CatalogLimitedItemWidgetView } from '../widgets/CatalogLimitedItemWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogSpinnerWidgetView } from '../widgets/CatalogSpinnerWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutDefaultView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const { currentOffer = null,currentPage,purchaseOptions = null } = useCatalog();

    return (
        <>
            <Grid>
                <Column size={ 7 } overflow="hidden">
                    { GetConfiguration('catalog.headers') && <CatalogHeaderView image={ currentPage.localization.getImage(0) }/> }
                    <CatalogItemGridWidgetView />
                </Column>
                <Column center={ !currentOffer } size={ 5 } overflow="hidden">
                    { !currentOffer &&
                    <>
                        { !!page.localization.getImage(1) && <img alt="" src={ page.localization.getImage(1) } /> }
                        <Text style={{color: "var(--test-galaxytext)"}} variant="none" center dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
                    </> }
                    { currentOffer &&
                    <>
                        <Base position="relative" overflow="hidden">
                            <CatalogViewProductWidgetView />
                            <CatalogLimitedItemWidgetView fullWidth position="absolute" className="top-1" />
                            <CatalogAddOnBadgeWidgetView position="absolute" className="bg-muted rounded bottom-1 end-1" />
                        </Base>
                        <Column grow gap={ 1 }>
                            <Text style={{color: "var(--test-galaxytext)"}} variant="none" grow truncate>{ currentOffer.localizationName }</Text>
                            { (purchaseOptions?.isDiscount) &&
                                <LayoutCatalogueDiscountView amountFree={ purchaseOptions?.amountFree } />
                            }
                            <Flex justifyContent="between">
                                <Column gap={ 1 }>
                                    <CatalogSpinnerWidgetView />
                                </Column>
                                <CatalogTotalPriceWidget justifyContent="end" alignItems="end" />
                            </Flex>
                            <CatalogPurchaseWidgetView />
                        </Column>
                    </> }
                    </Column>
            </Grid>
        </>
    );
}
