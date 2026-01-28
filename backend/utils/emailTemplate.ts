export const emailTemplate = function(name:string, profileURL: string){
  return(
    `
    <!DOCTYPE html>
    <html>
      <head>
          <title>Jarro - Portfolio</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </head>
      <body>
        <div style="width: 100%;">
          <div style="text-align:center; border: 1px solid black; padding: 20px; max-width: 500px; margin: auto;">
              <h1>LinkedIn Clone</h1><br />
              <h3>Welcome ${name}</h3><br />
              <a href=${profileURL}>Click here to visit your account</a>
          </div>
        </div>
      </body>
    </html>
    `
  )
}