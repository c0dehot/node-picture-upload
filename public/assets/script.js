/*
    note how we wrap our api fetch in this function that allows us to do some
    additional error / message handling for all API calls...
*/
async function fetchJSON( url, method='get', data={} ){
    method = method.toLowerCase()
    let settings = {
        headers: {
            'Session': localStorage.session ? localStorage.session : '',
            'Content-Type': 'application/json' },
        method
    }

    // only attach the body for put/post
    if( method === 'post' || method === 'put' ) {
        const isFormData = (typeof data)==='string'
        if( isFormData ){
            // for 'new FormData' generation we must NOT set content-type, let system do it
            delete settings.headers['Content-Type']
            //* gather form data (esp. if attached media)
            //! NOTE: each entry to be attached must have a valid **name** attribute
            settings.body = new FormData( document.querySelector(data) )
        } else {
            settings.body = JSON.stringify( data )
        }
    }

    return fetch( url,settings ).then( res=>res.json() )
}

function showAPIMessage( result ){
    /* put the api result message onto the screen as a message if it exists */
    if( result.status && result.message ){
        const apiResultEl = document.querySelector('#apiMessage')
        apiResultEl.innerHTML = result.message
        apiResultEl.classList.remove( 'd-none' )
        console.log( 'showing message: '+ result.message )
        setTimeout( function(){
            apiResultEl.classList.add( 'd-none' )
        }, 5000 )
    } else if( !result.status && result.message ){
        alert( 'Problems: ' + result.message )
    }

    return result
}


/* functions triggered by the html page */

function toggleMediaUpload( selectType='imageFile' ){
    console.log( '[toggleMediaUpload] this', selectType )

    if( selectType==='imageFile' ){
        document.querySelector('#imageUrl').classList.add('d-none');
        document.querySelector('#imageFile').classList.remove('d-none');
        document.querySelector('#imageSizeCol').classList.remove('d-none');
    } else {
        document.querySelector('#imageUrl').classList.remove('d-none');
        document.querySelector('#imageFile').classList.add('d-none');
        document.querySelector('#imageSizeCol').classList.add('d-none');
    }
}


async function mediaList( id ){
    const getRequest = await fetchJSON( '/api/media' )
    console.log( '[mediaList] ', getRequest )

    if( getRequest.status ){
        const mediaListEl = document.querySelector( '#mediaList' )
        mediaListEl.innerHTML = ''

        getRequest.mediaList.forEach( function( mediaUrl ){
            mediaListEl.innerHTML += `
            <img src='${mediaUrl}' class='img-thumbnail' width=100>
            `
        })
    }

}

// save the new form
async function uploadMedia( event ){
    event.preventDefault()

    //* because we are using the built-in browser form-builder, we need valid
    //! **name** attributes - for ease we give same values as the id's
    const uploadResponse = await fetchJSON( '/api/media', 'post', '#mediaForm' )
    console.log( '[uploadResponse] ', uploadResponse )
    showAPIMessage( uploadResponse )

    if( uploadResponse.status ){
        // clear the data
        document.querySelector('#imageUrl').value = ''
        document.querySelector('#imageFile').value = ''

        // refresh the list
        mediaList()
    }
}


// run once page has loaded
async function mainApp(){
    console.log( '[mainApp] starting...' )

    // default state
    toggleMediaUpload()

    // show the task list ...
    mediaList()
}