import Alert, {AlertProps} from "@mui/material/Alert";
import { alpha, styled } from '@mui/material/styles';


const ErrorAlert = styled(Alert)<AlertProps>(({ theme }) => ({
    backgroundColor: '#ffdad6',
    color: '#410002'
}),
);

export default ErrorAlert