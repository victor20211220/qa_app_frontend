import React, {useState} from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import 'yet-another-react-lightbox/styles.css';
import {getAvatar} from "../utils/helpers.js";

const ImageGridGallery = ({pictures}) => {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const slides = pictures.map(pic => ({src: getAvatar(pic)}));

    return (
        <>
            <div className="d-flex flex-wrap gap-3">
                {slides.map((slide, i) => (
                    <div key={i} className="image-upload-tile rounded-4">
                        <img
                            src={slide.src}
                            onClick={() => {
                                setIndex(i);
                                setOpen(true);
                            }}
                            className="w-100 h-100 object-fit-cover rounded-3 cursor-pointer"
                            alt=""
                        />
                    </div>
                ))}
            </div>

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={slides}
                index={index}
                plugins={[Fullscreen]}
            />
        </>
    );
};

export default ImageGridGallery;