//MUI imports
import { CssBaseline, ListItem, ListItemButton, ListItemText } from "@mui/material"

//interfaces imports
import { Tag } from "../interfaces"

//Misc imports
import { Zoom } from "react-awesome-reveal"

//React router imports
import { Link } from "react-router-dom"

interface TagCardProps {
    tag: Tag
}
const TagCard = ({ tag }: TagCardProps) => {

    return (
        <ListItem key={tag.id} sx={{
            backgroundColor: '#65597b',
            borderTop: '1px solid #ffffff',
            borderBottom: '1px solid #ffffff'
        }}>
            <ListItemButton component={Link} to={tag.id}>
                <CssBaseline />
                <Zoom>
                    <ListItemText sx={{ fontWeight: '100', color: '#ffffff' }} primary={tag.name} />
                </Zoom>
            </ListItemButton>
        </ListItem>
    )
}

export default TagCard
