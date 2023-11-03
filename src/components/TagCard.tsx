//MUI imports
import { CssBaseline, ListItem, ListItemButton, ListItemText } from "@mui/material"

//interfaces imports
import { Tag } from "../interfaces"

//Misc imports
import { Zoom } from "react-awesome-reveal"

//React router imports
import { Link } from "react-router-dom"

interface TagCardProps {
    tag : Tag
}
const TagCard = ({tag} : TagCardProps) => {
    
    return (
        <ListItem key={tag.id} sx={{
            backgroundColor: '#eaddff',
            borderRadius: '0.5rem',
        }}>
            <ListItemButton component={Link} to={tag.id}>
                <CssBaseline />
                <Zoom>
                    <ListItemText sx={{ fontWeight: '100', color: '#201634' }} primary={tag.name} />
                </Zoom>
            </ListItemButton>
        </ListItem>
    )
}

export default TagCard
