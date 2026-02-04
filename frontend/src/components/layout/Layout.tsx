import Navbar from "./Navbar"

const Layout = ({children}: {children: any}) => {
  return (
    <div className='min-h-screen bg-base-100'>
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  )
}

export default Layout;