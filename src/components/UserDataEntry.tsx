import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { SolidChatUser } from "../SolidChatUser";
import { Button } from "react-bootstrap";
import { useState } from "react";

export interface UserDataEntryProps {
    open: boolean;
    user: SolidChatUser;
    dialogClosed: () => void;
  }

export const UserDataEntry = (props: UserDataEntryProps) => {

    const {open, user, dialogClosed} = props;

    const handleClose = (event: object, reason: string) => {
        console.log(reason);
    };

    const dataEntered = () => {
        dialogClosed();
    }

    const [inputInvalid, setInputInalid] = useState(true);

    const validateInputs = () => {
        setInputInalid(!(Boolean(user.firstName && user.age && user.location && user.avatar) && user.age > 0));
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Please complete your profile</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    <p>In order for you to have the best user experience possible, we kindly
                    ask you to provide some information about you.</p>
                    <p><b>We do not store any of your personal information on our site except
                        for the duration of your chat session. We use your personal information
                        only for the purpose of personalized content moderation. After you log 
                        out, none of your personal data will be retained on our site. All of your 
                        personal data is stored in your personal Solid Pod.</b></p>
                </DialogContentText>
                <TextField
                    defaultValue={user.firstName}
                    autoFocus
                    required
                    margin="dense"
                    id="dialog-firstname"
                    name="firstname"
                    label="First Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(event) => {
                        user.firstName = event.target.value;
                        user.username = event.target.value;
                        validateInputs();
                    }}
                />
                <TextField
                    defaultValue={user.age}
                    required
                    margin="dense"
                    id="dialog-age"
                    name="age"
                    label="Age"
                    type="number"
                    fullWidth
                    variant="standard"
                    onChange={(event) => { user.age = Number(event.target.value); validateInputs() }}
                />
                <TextField
                    defaultValue={user.location}
                    required
                    margin="dense"
                    id="dialog-location"
                    name="location"
                    label="Location (Country)"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(event) => { user.location = event.target.value; validateInputs() }}
                />
                <TextField
                    defaultValue={user.avatar}
                    required
                    margin="dense"
                    id="dialog-avatar"
                    name="avatar"
                    label="Link to your Profile Picture"
                    type="url"
                    fullWidth
                    variant="standard"
                    onChange={(event) => { user.avatar = event.target.value; validateInputs() }}
                />
                </DialogContent>
                <DialogActions>
                    <Button
                        type="submit"
                        onClick={dataEntered}
                        disabled={inputInvalid}>
                            OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};