/*
   Renders a sqared box:
   - bgColor: props.color
   - width x height: theme.spacing(2x2)
   - border: {...theme.shape, "1px solid theme.palete.text.hint" }
   - marginRight: theme.spacing(1)
*/
import { styled } from "@material-ui/core/styles";
import BoxMaterial from '@material-ui/core/Box';

const Box = styled(BoxMaterial)( ({theme, color}) => ({
  width: theme.spacing(2),
  height: theme.spacing(2),
  marginRight: theme.spacing(1),
  ...theme.shape,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.text.hint,
  backgroundColor: color,
}));

export default Box;
