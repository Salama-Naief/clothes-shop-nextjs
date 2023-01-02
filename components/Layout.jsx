import Head from 'next/head'
import React from 'react'
import ConnctWithUs from './ConenctWithUs'
import HeadBar from './HeadBar'
import TopNavbar from './TopNavbar'
export default function Layout({children,title,desc,pages}) {



  return (
    <div>
        <Head>
        <title>{title?title:""}</title>
        <meta name="description" content={desc?desc:""} />
        <link rel="icon" href="/favicon.ico" />
        
      </Head>
        <main>
           <HeadBar pages={pages?pages:[]}/>
           <TopNavbar pages={pages?pages:[]}/>
           <div>
            {children}
           </div>
           
        </main>
        <footer>
            <ConnctWithUs/>
        </footer>
    </div>
  )
}
