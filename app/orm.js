const fs = require( 'fs' )

const dbFile = './medialist.data'

function getMedia(){
    console.log( `[getMedia] ${__dirname}` )
    if( !fs.existsSync( dbFile) ){
        return []
    }

    // split by the new-lines
    mediaList = fs.readFileSync( dbFile, 'utf8' ).split('\n')
    return mediaList
}

function saveMedia( mediaData ){
    fs.appendFileSync( dbFile, `${mediaData.imageUrl}\n` )
}

module.exports = {
    getMedia, saveMedia
}
