import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'
import MyFormComponent from '@/components/MyFormComponent'
//import Navbar from '@/components/Navbar'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  const {
    docs: [page],
  } = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'landing-page' },
    },
  })

  if (!page) {
    // return (
    //   // <div>
    //   //   <Navbar />
    //   //   <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
    //   //     Page not found
    //   //   </div>
    //   // </div>
    // )
  }

  return (
    <div>
      
      {/* 2. Main Page Content */}
      <main style={{ paddingBottom: '40px' }}>
        <h1 style={{ textAlign: 'center', margin: '32px 0 12px 0' }}>
          Hello Contact Form Test Application
        </h1>
        <div>
          <h2 style={{ textAlign: 'center', margin: '12px 0 24px 0', color: '#121010' }}>
            Contact Form
          </h2>
          <MyFormComponent formId="1" />
        </div>
      </main>
    </div>
  )
}