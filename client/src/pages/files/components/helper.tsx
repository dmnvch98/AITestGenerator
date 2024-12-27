import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";

export const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
        return <PictureAsPdfIcon sx={{color: '#FF0000'}}/>;
    }
    if (extension === 'doc' || extension === 'docx') {
        return <DescriptionIcon sx={{color: '#2B579A'}}/>;
    }
    return null;
};