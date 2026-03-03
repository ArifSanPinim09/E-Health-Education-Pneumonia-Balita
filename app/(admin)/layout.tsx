import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel - E-Health Pneumonia Balita',
  description: 'Panel administrasi untuk mengelola data responden dan konten pembelajaran',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
