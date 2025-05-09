import React, {useState} from 'react';
import {toast} from "react-toastify";
import {Button, Image} from "react-bootstrap";
import {getAvatar, uploadMaxFileSize} from "../../utils/helpers.js";

const MAX_FILE_SIZE = Number( uploadMaxFileSize ) * 1024 * 1024; // MB → bytes

const ImageUploader = ({files = [], setFiles, maxFiles, readonly = false}) => {
    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = React.useRef(0);

    const handleFiles = (e) => {
        const newFiles = Array.from(e.target.files);

        const oversized = newFiles.find(f => f.size > MAX_FILE_SIZE);
        if (oversized) {
            toast.error(`File "${oversized.name}" is too large. Max size is ${uploadMaxFileSize}MB.`);
            return;
        }

        if (files.length + newFiles.length > maxFiles) {
            toast.error(`You can only upload up to ${maxFiles} images.`);
            return;
        }
        setFiles([...files, ...newFiles]);
    };

    const handleDelete = (index) => {
        const updated = [...files];
        updated.splice(index, 1);
        setFiles(updated);
    };

    const handleDrop = (e) => {
        preventDefaults(e);
        dragCounter.current = 0;
        setIsDragging(false); // reset on drop
        const droppedFiles = Array.from(e.dataTransfer.files);

        const oversized = droppedFiles.find(f => f.size > MAX_FILE_SIZE);
        if (oversized) {
            toast.error(`File "${oversized.name}" is too large. Max size is ${uploadMaxFileSize}MB.`);
            return;
        }

        if (files.length + droppedFiles.length > maxFiles) {
            toast.error(`You can only upload up to ${maxFiles} images.`);
            return;
        }
        setFiles([...files, ...droppedFiles]);
    };

    const handleDragEnter = (e) => {
        preventDefaults(e);
        dragCounter.current += 1;
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        preventDefaults(e);
        dragCounter.current -= 1;
        if (dragCounter.current === 0) {
            setIsDragging(false);
        }
    };

    const preventDefaults = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };


    return (
        <div>
            {!readonly && (
                <>
                    <label
                        htmlFor="file-upload"
                        className={`text-center w-100 mb-3 p-4 border border-2 border-dashed rounded-4 ${isDragging ? 'border-primary' : ''}`}
                        style={{cursor: 'pointer'}}
                        onDrop={handleDrop}
                        onDragOver={preventDefaults}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                    >
                        <div><i className="fa-solid fa-camera"></i> Drag images here or click to upload</div>
                        <div className="text-muted small">Max {maxFiles} images, max {uploadMaxFileSize}MB each</div>
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={handleFiles}
                    />
                </>
            )}

            <div className="d-flex flex-wrap gap-3">
                {files.map((file, index) => (
                    <div key={index}
                         className={`position-relative image-upload-tile ${!readonly && "p-3 border border-2 border-dashed"} rounded-4`}>
                        <Image
                            src={file.existing ? getAvatar(file.preview) : URL.createObjectURL(file)}
                            alt={`preview-${index}`}
                            width={100}
                            height={100}
                            className="w-100 h-100 object-fit-cover rounded-3"
                        />
                        {!readonly && (
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(index)}
                                className="position-absolute top-0 end-0 m-1 rounded-circle d-flex align-items-center justify-content-center p-0"
                                style={{width: '24px', height: '24px', fontSize: '0.75rem'}}
                            >
                                <i className="fa-solid fa-times"></i>
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
};


export default ImageUploader;
