import {createMuiTheme} from "@material-ui/core";
import blue from "@material-ui/core/colors/blue";
import pink from "@material-ui/core/colors/pink";

export default createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: {main: blue["500"]},
        secondary: {main: pink["500"]},
    },
    overrides: {
        MuiButton: {
            root: {
                margin: "5px 5px 5px 0",
            }
        },
        MuiFormControl: {
            root: {
                margin: "5px 5px 5px 0",
            }
        }
    },
});