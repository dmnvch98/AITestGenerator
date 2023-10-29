import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {Box} from "@mui/material";

export const CkTextEditor = ({ initialText, onTextChange }:
                                 { initialText: string, onTextChange: (content: string) => void }) => {

    return (
        <Box>
            <CKEditor
                editor={ClassicEditor}
                data={initialText}
                config={{
                    toolbar: {
                        items: [
                            'heading',
                            'autoformat',
                            '|',
                            'bold',
                            'italic',
                            'underline',
                            '|',
                            '|',
                            'bulletedList',
                            'numberedList',
                            '|',
                            'undo',
                            'redo'
                        ],
                    }
                }}

                onChange={(event, editor) => {
                    const data = editor.getData();
                    onTextChange(data);
                }}
            />
        </Box>
    );
}

