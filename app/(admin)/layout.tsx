import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel - ENIS-Pneumonia Care',
  description: 'Panel administrasi untuk mengelola data responden dan konten pembelajaran',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
