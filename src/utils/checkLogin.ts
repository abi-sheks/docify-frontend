import {BackendClient} from './client'

const checkLogin = async (dispatch : any, userAdded : any) => {
    try{
        const data = (await BackendClient.get('whoami/')).data
        console.log(data)
        //ok
        dispatch(
            userAdded({
                username: data.username,
                email: data.email,
            })
        )
    }
    catch(error)
    {
        console.log(error)
    }
}

export default checkLogin;