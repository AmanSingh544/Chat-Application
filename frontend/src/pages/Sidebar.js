import { Box, Typography } from "@mui/material";
import { RoomSelectorPage } from "./RoomSelectorPage";

const Sidebar = () => {


    return (
        <>
        <Box sx={{display:'flex', flexDirection:'column', maxHeight:'100vh'}}>
            <Box sx={{maxHeight:'40vh', background:'wheat'}}>
                <Typography>Logo</Typography>
            </Box>
            <Box sx={{maxHeight:'60vh'}}>
                <RoomSelectorPage />
            </Box>
        </Box>
        </>
    )
}

export default Sidebar;