// hard-coded settings (should be in the .env)
const UPLOAD_PATH = process.env.UPLOAD_PATH || 'public/uploads/'

const orm = require('./orm')
const uploadResizer = require( './uploadResizer' )
const upload = require('multer')({ dest: UPLOAD_PATH })
const publicPath = '../'

function router( app ){
// media upload looks for a picture file called 'imageFile'
    app.post( '/api/media', upload.single('imageFile'), async function( req, res ){
        // console.log( '[api/media] POST ', req.body, req.file )

        let mediaData = req.body
        // if they uploaded a file, let's add it to the thumbData
        if( req.file ){
            const [ resizeWidth, resizeHeight ] = mediaData.imageSize.split('x')
            const imageUrl = await uploadResizer(publicPath+req.file.path, req.file.originalname, resizeWidth, resizeHeight);
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