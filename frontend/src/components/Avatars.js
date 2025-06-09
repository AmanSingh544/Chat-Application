
import { deepOrange, deepPurple, green, blue, teal } from '@mui/material/colors';
import {
    Tooltip,
    Avatar,
} from '@mui/material';

const AvatarLogo = ({ tooltipTitle, avatarText, index, clickFn }) => {
    const colors = [deepOrange[500], deepPurple[500], green[500], blue[500], teal[500]];

    const handleClick = () => {
        clickFn && clickFn();
    };

    return (
        <Tooltip title={tooltipTitle}>
            <Avatar onClick={handleClick}
                sx={{ bgcolor: colors[index % colors.length], width: 36, height: 36 , cursor: ` ${clickFn != (undefined || null ) ? 'pointer' : '' }`}}
            >
                {avatarText}
            </Avatar>
        </Tooltip>
    );
}

export default AvatarLogo;