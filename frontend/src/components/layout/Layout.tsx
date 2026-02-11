import Navbar from "./Navbar"

const Layout = ({children}: {children: any}) => {
  return (
    <div className='min-h-screen app-parent'>
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  )
}

export default Layout;