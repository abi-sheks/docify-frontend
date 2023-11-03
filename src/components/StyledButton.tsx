import * as React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import { ButtonBaseProps } from '@mui/material/ButtonBase';

const SuccessSlider = styled(Button)<ButtonProps>(({ theme }) => ({
    backgroundColor: '#006492',
    color: '#ffffff'
}),
);

export default SuccessSlider;