import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
// import ListItemText from "@mui/material/ListItemText";
// import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
// import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { ListItem, TextField } from "@mui/material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function AddTravelCardModal() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Travel Card
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Travel Memoir
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              add
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem>
            <TextField fullWidth label="Title" defaultValue={""} />
          </ListItem>
          <ListItem>
            <TextField fullWidth label="Location" defaultValue={""} />
          </ListItem>
          <ListItem>
            <TextField fullWidth label="Image" defaultValue={""} />
          </ListItem>
          <ListItem>
            <Button sx={{ boxShadow: 0 }} variant="contained">
              add
            </Button>
          </ListItem>
        </List>
      </Dialog>
    </React.Fragment>
  );
}
