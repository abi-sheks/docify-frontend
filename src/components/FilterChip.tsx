import { Chip } from '@mui/material'

interface FilterChipProps {
    tagName : string,
    handleFilterDelete : any
}

const FilterChip = ({tagName, handleFilterDelete} : FilterChipProps) => {
    return (
        <Chip key={tagName} variant='outlined' onDelete={() => handleFilterDelete(tagName)} label={tagName} sx={{
            backgroundColor: "#eaddff",
            color: '#201634'
        }}></Chip>
    )
}

export default FilterChip
