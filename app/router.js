// hard-coded settings (should be in the .env)
const HTML_PATH = process.env.HTML_PATH || 'public/'
const UPLOAD_PATH = process.env.UPLOAD_PATH || 'uploads/'
const orm = require('./orm')
const upload = require('multer')({ dest: HTML_PATH+UPLOAD_PATH })
// first entry (../) is relative location of the image to current path
const imageTool = require( './imageTool' )('../',UPLOAD_PATH)

function router( app ){
// media upload looks for a picture file called 'imageFile'
    app.post( '/api/media', upload.single('imageFile'), async function( req, res ){
        // console.log( '[api/media] POST ', req.body, req.file )

        let mediaData = req.body
        // if they uploaded a file, let's add it to the thumbData
        if( req.file ){
            const [ resizeWidth, resizeHeight ] = mediaData.imageSize.split('x')
            const imageUrl = await imageTool.resize( req.file, resizeWidth, resizeHeight);
            // assign in the thumbData so can use as normal
            mediaData.imageUrl = imageUrl
            mediaData.name = req.file.originalname
        }
        console.log( '[POST api/thumbnails] recieved'+(req.file ? `; attached file @ ${mediaData.imageSize}`:''), mediaData );

        if( mediaData.imageUrl==='' ) {
            // we can't save this picturegram without an image so abort
            res.send( { error: `Sorry problem uploading ${mediaData.name}` } )
        }

        // save this
        await orm.saveMedia( mediaData )

        res.send( { status: true, mediaData, message: `Thank you, saved ${mediaData.name}` } )
    })

    app.get( '/api/media', async function( req, res ){
        console.log( '[api/media] getting the list' )
        const mediaList = await orm.getMedia()
        res.send( { status: true, mediaList } )
    })
}

module.exports = router