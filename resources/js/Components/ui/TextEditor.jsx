import { useEffect, useRef } from "react";

const TextEditor = ({ value, onChange }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        tinymce.init({
            selector: "#my-editor",
            height: 300,
            menubar: false,
            plugins: "link image code",
            toolbar:
                "undo redo | bold italic | alignleft aligncenter alignright",
            setup: function (editor) {
                editorRef.current = editor;

                editor.on("Change KeyUp", function () {
                    const content = editor.getContent();
                    onChange({ target: { name: "paragraph", value: content } });
                });
            },
        });

        return () => {
            if (tinymce.get("my-editor")) {
                tinymce.get("my-editor").remove();
            }
        };
    }, []);

    // Update editor content when `value` changes
    useEffect(() => {
        if (editorRef.current && editorRef.current.getContent() !== value) {
            editorRef.current.setContent(value || "");
        }
    }, [value]);

    return (
        <textarea
            id="my-editor"
            className="w-full border border-gray-300 rounded-md p-2"
        />
    );
};

export default TextEditor;
