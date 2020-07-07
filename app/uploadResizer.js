// quick function used for file uploads to rename with extension
// **NOTE** we hardcode the root static folder to 'public', change line 25 if different

const fs = require('fs');
const sharp = require('sharp');

async function uploadResizer( filePath, originalName, resizeWidth=0, resizeHeight=0 ){
    const fileExt = originalName.toLowerCase().substr((originalName.lastIndexOf('.')))
        .replace('jpeg','jpg');
    const filePathWithExt = filePath+fileExt;
    resizeWidth = Math.round(resizeWidth); resizeHeight = Math.round(resizeHeight);
    if( resizeWidth>0 && resizeHeight>0 ){
        // resize if given parameters
        await sharp(`${__dirname}/${filePath}`)
            .resize(resizeWidth, resizeHeight, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .toFile(`${__dirname}/${filePathWithExt}`);
        console.log( `** resized ${resizeWidth}x${resizeHeight} for ${__dirname}/${filePathWithExt}` );
        // remove the original file
        fs.unlinkSync(`${__dirname}/${filePath}`)
    } else {
        fs.renameSync( `${__dirname}/${filePath}`, `${__dirname}/${filePathWithExt}` );
    }

    // everything after the public directory; ie its relative path in the browser
    return filePathWithExt.split('/public/')[1];
}

module.exports = uploadResizer;