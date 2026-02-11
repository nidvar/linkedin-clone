import Navbar from "./Navbar"

const Layout = ({children}: {children: any}) => {
  return (
    <div className='min-h-screen'>
      <Navbar />
      <main className="app-parent">
        {children}
      </main>
    </div>
  )
}

export default Layout;