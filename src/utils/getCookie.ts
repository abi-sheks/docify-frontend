export default function getCookie(name : string) {
    if(!document)
    {
        console.log("no document")
        return null
    }
    if (!document.cookie) {
      console.log("no cookie")
      return null;
    }
    
    const xsrfCookies = document.cookie.split("=")[1]
    return xsrfCookies
    
  
    if (xsrfCookies.length === 0) {
      console.log("noxsrf")
      return null;
    }
    return decodeURIComponent(xsrfCookies[0].split('=')[1]);
  }