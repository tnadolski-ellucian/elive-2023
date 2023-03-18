import { makeStyles } from '@ellucian/react-design-system/core';
import { spacing40, widthFluid, colorBrandNeutral200 } from '@ellucian/react-design-system/core/styles/tokens';

export const useStyles = makeStyles((theme) => ({
    card: {
        margin: `0 ${spacing40}`
    },
    tableContainer: {
        width: widthFluid,
        marginTop: theme.spacing(3)
    },
    table: {
        margin: theme.spacing(3),
        minWidth: 500,
        '& thead tr th': {
            'backgroundColor': colorBrandNeutral200
        }
    },
    smallCell: {
        width: '10%'
    },
    primaryCell: {
        width: '50%'
    },
    searchContainer: {
        margin: spacing40
    },
    switch: {
        margin: `0 ${spacing40}`
    }
}));
